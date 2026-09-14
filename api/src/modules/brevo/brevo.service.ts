import { BrevoClient } from "@getbrevo/brevo";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface InterneeNotificationData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  about: string;
}

@Injectable()
export class BrevoService {
  private readonly logger = new Logger(BrevoService.name);
  private brevoClient: BrevoClient | null = null;
  private readonly senderEmail: string;
  private readonly senderName: string;
  private readonly adminEmails: string[];

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("BREVO_API_KEY");
    if (apiKey) {
      this.brevoClient = new BrevoClient({ apiKey });
    } else {
      this.logger.warn("BREVO_API_KEY is not configured in environment variables. Email notifications will be disabled.");
    }

    this.senderEmail = this.configService.get<string>("BREVO_SENDER_EMAIL") || "noreply@sharkstack.com";
    this.senderName = this.configService.get<string>("BREVO_SENDER_NAME") || "SharkStack";

    const configuredAdmins = this.configService.get<string>("ADMIN_EMAILS");
    if (configuredAdmins) {
      this.adminEmails = configuredAdmins.split(",").map((email) => email.trim());
    } else {
      this.adminEmails = ["shibbalfarooq66@gmail.com"];
    }
  }

  async sendInterneeRegistrationNotification(internee: InterneeNotificationData): Promise<boolean> {
    if (!this.brevoClient) {
      this.logger.warn(`Skipping Brevo notification for internee ${internee.name} - BREVO_API_KEY missing.`);
      return false;
    }

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
            .header { background-color: #0f172a; color: #ffffff; padding: 15px 20px; border-radius: 6px 6px 0 0; text-align: center; }
            .content { padding: 20px; background-color: #f8fafc; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #475569; display: block; margin-bottom: 5px; }
            .value { background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #cbd5e1; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0;">New Internee Registration Alert</h2>
            </div>
            <div class="content">
              <p>A new internee has registered on SharkStack!</p>
              
              <div class="field">
                <span class="label">Full Name:</span>
                <div class="value">${internee.name}</div>
              </div>

              <div class="field">
                <span class="label">Email Address:</span>
                <div class="value"><a href="mailto:${internee.email}">${internee.email}</a></div>
              </div>

              <div class="field">
                <span class="label">Phone Number:</span>
                <div class="value">${internee.phone}</div>
              </div>

              <div class="field">
                <span class="label">About / Bio:</span>
                <div class="value">${internee.about.replace(/\n/g, "<br/>")}</div>
              </div>

              ${
                internee.id
                  ? `
              <div class="field">
                <span class="label">Registration ID:</span>
                <div class="value">${internee.id}</div>
              </div>`
                  : ""
              }
            </div>
            <div class="footer">
              <p>This is an automated notification sent from the SharkStack backend.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const response = await this.brevoClient.transactionalEmails.sendTransacEmail({
        subject: `New Internee Registered: ${internee.name}`,
        sender: { name: this.senderName, email: this.senderEmail },
        to: this.adminEmails.map((email) => ({ email })),
        htmlContent,
        textContent: `New Internee Registered:\nName: ${internee.name}\nEmail: ${internee.email}\nPhone: ${internee.phone}\nAbout: ${internee.about}`
      });

      this.logger.log(`Brevo notification sent for internee ${internee.name}. Response: ${JSON.stringify(response)}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send Brevo internee registration email: ${error?.message || error}`, error?.stack);
      return false;
    }
  }
}
