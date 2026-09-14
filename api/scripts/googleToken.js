/**
 * get-google-refresh-token.js
 * -----------------------------------------------------------------------
 * One-off script to re-issue a Google Calendar OAuth refresh token when
 * the stored one starts throwing `invalid_grant`.
 *
 * Uses the SAME `googleapis` library your GoogleCalendarService already
 * depends on, so no new packages are needed - just run it from your
 * project root where `googleapis` is already installed:
 *
 *   node get-google-refresh-token.js
 *
 * SETUP (one-time, in Google Cloud Console):
 * 1. Go to APIs & Services -> Credentials -> your OAuth 2.0 Client ID
 *    (the same one behind GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).
 * 2. Under "Authorized redirect URIs", add:
 *      http://localhost:3000/oauth2callback
 * 3. Go to APIs & Services -> OAuth consent screen -> Audience/Test users.
 *    If the app's Publishing status is "Testing", make sure the Google
 *    account you're about to authorize with is listed as a test user -
 *    otherwise Google will block the consent screen entirely.
 *
 * USAGE:
 * 1. Fill in CLIENT_ID / CLIENT_SECRET below (or export them as env vars
 *    GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET before running).
 * 2. Run the script. It prints a URL.
 * 3. Open that URL, sign in with the Google account that owns/has access
 *    to the target calendar, and approve access.
 * 4. Google redirects back to localhost:3000 - the script catches the
 *    callback automatically and prints your new refresh_token.
 * 5. Copy that value into GOOGLE_REFRESH_TOKEN in your env/secrets store
 *    and restart the app.
 *
 * NOTE: Google only issues a refresh_token on the FIRST consent, or when
 * `prompt: "consent"` forces a fresh one (which this script always does) -
 * so this will always hand you a new one, even if you've authorized this
 * app with this account before.
 * -----------------------------------------------------------------------
 */

const http = require("http");
const { google } = require("googleapis");
require('dotenv').config();

console.log("CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("CLIENT_SECRET =", process.env.GOOGLE_CLIENT_SECRET ? "FOUND" : "MISSING");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "PASTE_YOUR_CLIENT_ID_HERE";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "PASTE_YOUR_CLIENT_SECRET_HERE";
const REDIRECT_URI = "http://localhost:3000";
const PORT = 3000;

// Matches the scope your GoogleCalendarService needs (freebusy query +
// event insert). Adjust if your app requests a narrower scope elsewhere.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

if (CLIENT_ID.startsWith("PASTE_") || CLIENT_SECRET.startsWith("PASTE_")) {
    console.error(
        "\nSet GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET as env vars, or edit this file directly, before running.\n",
    );
    process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // required to get a refresh_token back
    prompt: "consent", // forces Google to issue a NEW refresh_token every run
    scope: SCOPES,
});

console.log("\nOpen this URL in your browser and approve access with the calendar's Google account:\n");
console.log(authUrl);
console.log("\nWaiting for the redirect back to localhost...\n");

const server = http.createServer(async (req, res) => {
    if (!req.url.startsWith("/")) {
        res.writeHead(404);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(`Authorization failed: ${error}. Check the terminal and try again.`);
        console.error(`\nAuthorization failed: ${error}\n`);
        server.close();
        process.exit(1);
    }

    if (!code) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("No authorization code received.");
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Success - you can close this tab and go back to the terminal.");

        if (!tokens.refresh_token) {
            console.error(
                "\nNo refresh_token came back. This usually means the account already has an active " +
                "grant for this app and Google skipped issuing a new one despite prompt=consent - " +
                "revoke access first at https://myaccount.google.com/permissions, then re-run this script.\n",
            );
            server.close();
            process.exit(1);
        }

        console.log("\nSuccess! New refresh token:\n");
        console.log(tokens.refresh_token);
        console.log("\nSet this as GOOGLE_REFRESH_TOKEN in your env/secrets store, then restart the app.\n");
    } catch (err) {
        console.error(`\nFailed to exchange code for tokens: ${err.message}\n`);
    } finally {
        server.close();
        process.exit(0);
    }
});

server.listen(PORT, () => {
    // Intentionally quiet here - the auth URL above is the actionable output.
});