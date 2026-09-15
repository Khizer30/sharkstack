import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eq } from "drizzle-orm";
import { internees } from "@models/internees";
import { BrevoService } from "@modules/brevo/brevo.service";
import { CloudinaryService } from "@modules/cloudinary/cloudinary.service";
import { DatabaseService } from "@modules/database/database.service";
import { CreateInterneeDto } from "@modules/internees/internees.dto";
import { ExchangeRateService } from "@modules/safepay/exchange-rate.service";
import { SafepayService } from "@modules/safepay/safepay.service";

@Injectable()
export class InterneesService {
  private readonly logger = new Logger(InterneesService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly brevoService: BrevoService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly safepayService: SafepayService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly configService: ConfigService
  ) {}

  async create(dto: CreateInterneeDto, file?: Express.Multer.File) {
    let resumeUrl: string | undefined;

    // Upload resume to Cloudinary if provided
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file, "internee-resumes");
        resumeUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Failed to upload resume to Cloudinary:", error);
        // Continue without resume URL if upload fails
      }
    }

    const [newInternee] = await this.databaseService.db
      .insert(internees)
      .values({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        about: dto.about,
        resumeUrl: resumeUrl || null
      })
      .returning();

    // Trigger email notification to admins via Brevo
    await this.brevoService.sendInterneeRegistrationNotification(newInternee);

    const checkoutUrl = await this.initiatePayment(newInternee);

    return { internee: newInternee, checkoutUrl };
  }

  /**
   * Kicks off the Safepay masterclass-fee checkout for a newly created internee.
   * Returns null (never throws) when Safepay isn't configured yet or the gateway
   * call fails, so registration is never blocked by payment issues.
   */
  private async initiatePayment(internee: typeof internees.$inferSelect): Promise<string | null> {
    if (!this.safepayService.isEnabled) {
      this.logger.warn(`Skipping Safepay checkout for internee ${internee.id} - Safepay is not configured.`);
      return null;
    }

    try {
      const { amountPkrCents, rate } = await this.exchangeRateService.convertUsdCentsToPkrCents(internee.amountUsdCents);
      const { userToken, trackerToken } = await this.safepayService.startTransaction({
        orderId: internee.id,
        amountPkrCents
      });

      await this.databaseService.db
        .update(internees)
        .set({ exchangeRate: rate, amountPkrCents, safepayTrackerToken: trackerToken })
        .where(eq(internees.id, internee.id));

      const frontendUrl = this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:5173";
      const redirectUrl = this.configService.get<string>("SAFEPAY_REDIRECT_URL") ?? `${frontendUrl}/ai-training/payment-result?status=success`;
      const cancelUrl = this.configService.get<string>("SAFEPAY_CANCEL_URL") ?? `${frontendUrl}/ai-training/payment-result?status=failure`;

      return this.safepayService.buildCheckoutUrl({
        userToken,
        trackerToken,
        orderId: internee.id,
        // Safepay also appends its own `tracker` param to these on redirect.
        redirectUrl: `${redirectUrl}&internee=${internee.id}`,
        cancelUrl: `${cancelUrl}&internee=${internee.id}`
      });
    } catch (error) {
      this.logger.error(`Safepay checkout initiation failed for internee ${internee.id}: ${error.message}`);
      return null;
    }
  }

  async findAll() {
    return { internees: await this.databaseService.db.select().from(internees) };
  }

  async getPaymentStatus(id: string) {
    const [internee] = await this.databaseService.db.select().from(internees).where(eq(internees.id, id)).limit(1);
    if (!internee) {
      throw new NotFoundException("Internee not found");
    }

    return {
      paymentStatus: internee.paymentStatus,
      amountUsdCents: internee.amountUsdCents,
      amountPkrCents: internee.amountPkrCents
    };
  }

  async handleSafepayWebhook(payload: { data?: { state?: string; metadata?: { order_id?: string } } }): Promise<void> {
    const orderId = payload.data?.metadata?.order_id;
    if (!orderId) {
      throw new NotFoundException("Missing order_id in webhook metadata");
    }

    const paid = payload.data?.state === "TRACKER_ENDED";
    await this.databaseService.db
      .update(internees)
      .set({ paymentStatus: paid ? "PAID" : "FAILED", paidAt: paid ? new Date() : null })
      .where(eq(internees.id, orderId));
  }
}
