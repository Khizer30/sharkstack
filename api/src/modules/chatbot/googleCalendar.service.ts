import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";
import { google, calendar_v3, Auth } from "googleapis";

// Guarantees these env vars are available even if ConfigModule isn't fully
// wired up yet when this service is constructed. dotenv.config() never
// overwrites vars already set in process.env, so this is safe alongside
// ConfigModule.
dotenv.config();

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  label: string;
}

@Injectable()
export class GoogleCalendarService implements OnModuleInit {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar: calendar_v3.Calendar | null = null;
  private calendarId: string | null = null;
  private oauth2Client: any = null;

  // Refresh proactively if the access token is within this many ms of
  // expiring, so a request never fires with a token that dies mid-flight.
  private static readonly TOKEN_REFRESH_BUFFER_MS = 60 * 1000;

  constructor(private readonly configService: ConfigService) {
    const calendarId = this.configService.get<string>("GOOGLE_CALENDAR_ID") ?? process.env.GOOGLE_CALENDAR_ID;
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID") ?? process.env.GOOGLE_CLIENT_ID;
    const clientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET") ?? process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = this.configService.get<string>("GOOGLE_REFRESH_TOKEN") ?? process.env.GOOGLE_REFRESH_TOKEN;
    // Not used to refresh anything - the OAuth2 constructor just wants one.
    // Only matters if you ever regenerate the refresh token via the consent
    // screen again; it must match whatever redirect URI you used then.
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "http://localhost:3000";

    if (!calendarId || !clientId || !clientSecret || !refreshToken) {
      this.logger.warn(
        "Google Calendar credentials are missing. Required: GOOGLE_CALENDAR_ID, GOOGLE_CLIENT_ID, " + "GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN."
      );
      return;
    }

    try {
      this.calendarId = calendarId;

      const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      // This one line is what makes it fully autonomous: giving the client
      // only a refresh_token (no access_token) is enough. Every request
      // library call under the hood checks whether the current access token
      // is missing/expired and, if so, silently exchanges the refresh_token
      // for a new one via Google's token endpoint - no browser, no consent
      // screen, no human involved. That exchange is only ever blocked if
      // the refresh token itself has been revoked or expired (see the
      // invalid_grant handling below).
      client.setCredentials({ refresh_token: refreshToken });

      // Purely observational - the actual refresh already happened via the
      // line above / ensureFreshAccessToken() below. Handy for logs and for
      // catching rare refresh_token rotation.
      client.on("tokens", (tokens: Auth.Credentials) => {
        if (tokens.refresh_token) {
          this.logger.warn(
            "Google issued a NEW refresh_token. Update GOOGLE_REFRESH_TOKEN in your env/secret " +
              "store - the old one may stop working and this new one is not persisted automatically."
          );
        }
        if (tokens.access_token) {
          const expiry = tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : "unknown";
          this.logger.debug(`Google OAuth2 access token refreshed, expires ${expiry}`);
        }
      });

      this.oauth2Client = client;
      this.calendar = google.calendar({ version: "v3", auth: client as any });

      this.logger.log("Google Calendar initialized via OAuth2 (refresh token) - no login required.");
    } catch (error) {
      this.logger.error(error);
      this.calendar = null;
      this.calendarId = null;
      this.oauth2Client = null;
    }
  }

  isConfigured(): boolean {
    return this.calendar !== null && this.calendarId !== null && this.oauth2Client !== null;
  }

  /**
   * Runs once when Nest finishes bootstrapping the module. Fetches and
   * caches the first access token immediately at startup (using the stored
   * refresh token, no login involved) so the very first real request never
   * has to pay for that exchange - it just reuses the cached, in-memory
   * `oauth2Client.credentials` until it's about to expire. If this fails
   * (e.g. a revoked refresh token), we log it but don't crash app startup -
   * ensureFreshAccessToken() will surface the same error clearly on the
   * first real request instead.
   */
  async onModuleInit(): Promise<void> {
    if (!this.isConfigured()) {
      return;
    }
    try {
      await this.ensureFreshAccessToken();
      this.logger.log("Google Calendar access token pre-fetched and cached at startup.");
    } catch (error: unknown) {
      this.logger.warn(`Google Calendar token pre-fetch at startup failed (will retry on first request): ${(error as Error).message}`);
    }
  }

  /**
   * Proactively checks whether the current access token is missing/expired
   * and, if so, exchanges the refresh token for a new one. Called at the
   * top of every public method that hits the Calendar API.
   *
   * google-auth-library's request path already auto-refreshes transparently
   * on every call, so this isn't strictly required for the "no login"
   * behavior to work - but doing it explicitly here surfaces a clear,
   * actionable error immediately if the refresh token itself is invalid or
   * revoked, instead of a generic 401 buried inside a calendar.* call.
   */
  private async ensureFreshAccessToken(): Promise<void> {
    if (!this.oauth2Client) {
      throw new Error("Google Calendar is not configured");
    }

    const { access_token, expiry_date } = this.oauth2Client.credentials;
    const isExpiredOrMissing = !access_token || !expiry_date || expiry_date <= Date.now() + GoogleCalendarService.TOKEN_REFRESH_BUFFER_MS;

    if (!isExpiredOrMissing) {
      return;
    }

    try {
      // getAccessToken() checks expiry internally and calls
      // refreshAccessToken() under the hood if needed, using the stored
      // refresh_token - updating this.oauth2Client.credentials in place.
      // This is the "auto create new token" behavior you're after.
      const { token } = await this.oauth2Client.getAccessToken();
      if (!token) {
        throw new Error("Token refresh returned an empty access token");
      }
    } catch (error: unknown) {
      const errMsg = (error as Error).message;
      this.logger.error(`Failed to refresh Google OAuth2 access token: ${errMsg}`);
      if (errMsg.includes("invalid_grant")) {
        throw new Error(
          "Google Calendar integration is temporarily disabled. The refresh token has been revoked or " +
            "expired and must be renewed by an administrator (re-run the OAuth consent flow once to get a new one)."
        );
      }
      throw new Error(`Google Calendar authentication failed: ${errMsg}`);
    }
  }

  private getTimezoneOffset(timeZone: string, date: Date): number {
    try {
      const tzString = date.toLocaleString("en-US", { timeZone, timeZoneName: "longOffset" });
      const match = tzString.match(/GMT([+-]\d+)?(?::(\d+))?/);
      if (!match) {
        return 0;
      }
      const offsetHours = parseInt(match[1] || "0", 10);
      const offsetMinutes = parseInt(match[2] || "0", 10);
      return (offsetHours * 60 + (offsetHours < 0 ? -offsetMinutes : offsetMinutes)) * 60 * 1000;
    } catch {
      return 0;
    }
  }

  private getUTCForTimeInTimezone(dateStr: string, hour: number, minute: number, timeZone: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number);
    const baseUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    const offset = this.getTimezoneOffset(timeZone, new Date(baseUtc));
    return new Date(baseUtc - offset);
  }

  async getCalendarTimezone(): Promise<string> {
    if (!this.calendar || !this.calendarId) {
      throw new Error("Google Calendar is not configured");
    }
    await this.ensureFreshAccessToken();
    try {
      const res = await this.calendar.calendars.get({ calendarId: this.calendarId });
      return res.data.timeZone ?? "UTC";
    } catch (error: unknown) {
      this.logger.error(`Failed to fetch calendar timezone: ${(error as Error).message}`);
      return "UTC";
    }
  }

  async getAvailableSlots(dateStr: string): Promise<AvailableSlot[]> {
    if (!this.calendar || !this.calendarId) {
      throw new Error("Google Calendar integration is not configured");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error("Invalid date format. Expected YYYY-MM-DD.");
    }

    await this.ensureFreshAccessToken();

    const timeZone = await this.getCalendarTimezone();

    // Business hours: 09:00 to 17:00
    const startOfBusiness = this.getUTCForTimeInTimezone(dateStr, 9, 0, timeZone);
    const endOfBusiness = this.getUTCForTimeInTimezone(dateStr, 17, 0, timeZone);
    const now = new Date();

    let response;
    try {
      response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startOfBusiness.toISOString(),
          timeMax: endOfBusiness.toISOString(),
          timeZone,
          items: [{ id: this.calendarId }]
        }
      });
    } catch (error: unknown) {
      const errMsg = (error as Error).message;
      if (errMsg.includes("invalid_grant")) {
        this.logger.error("Google Calendar authorization token has expired/been revoked.");
        throw new Error(
          "Google Calendar integration is temporarily disabled. The authorization token has expired " + "and must be renewed by the administrator."
        );
      }
      throw error;
    }

    const busyList = response.data.calendars?.[this.calendarId]?.busy ?? [];

    const slots: AvailableSlot[] = [];
    const formatTimeLabel = (h: number) => {
      const ampm = h >= 12 ? "PM" : "AM";
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      return `${String(displayHour).padStart(2, "0")}:00 ${ampm}`;
    };

    for (let h = 9; h < 17; h++) {
      const slotStart = this.getUTCForTimeInTimezone(dateStr, h, 0, timeZone);
      const slotEnd = this.getUTCForTimeInTimezone(dateStr, h + 1, 0, timeZone);

      if (slotEnd <= now) {
        continue;
      }

      const isOverlapping = busyList.some((busy) => {
        if (!busy.start || !busy.end) {
          return false;
        }
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      if (!isOverlapping) {
        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          label: `${formatTimeLabel(h)} - ${formatTimeLabel(h + 1)} (${timeZone})`
        });
      }
    }

    return slots;
  }

  async bookMeeting(details: {
    startTime: string;
    endTime: string;
    summary: string;
    description?: string;
    clientEmail: string;
    clientName: string;
  }): Promise<{ htmlLink: string | null; eventId: string | null }> {
    if (!this.calendar || !this.calendarId) {
      throw new Error("Google Calendar integration is not configured");
    }

    await this.ensureFreshAccessToken();

    const timeZone = await this.getCalendarTimezone();

    const event: calendar_v3.Schema$Event = {
      summary: details.summary,
      description: details.description,
      start: { dateTime: details.startTime, timeZone },
      end: { dateTime: details.endTime, timeZone },
      attendees: [
        {
          email: details.clientEmail,
          displayName: details.clientName,
          responseStatus: "needsAction"
        }
      ],
      reminders: { useDefault: true }
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        sendUpdates: "all"
      });

      return {
        htmlLink: response.data.htmlLink ?? null,
        eventId: response.data.id ?? null
      };
    } catch (error: unknown) {
      const errMsg = (error as Error).message;
      this.logger.error(`Failed to book meeting: ${errMsg}`);
      if (errMsg.includes("invalid_grant")) {
        throw new Error(
          "Google Calendar integration is temporarily disabled. The authorization token has expired " + "and must be renewed by the administrator."
        );
      }
      throw new Error(`Google Calendar booking failed: ${errMsg}`);
    }
  }
}
