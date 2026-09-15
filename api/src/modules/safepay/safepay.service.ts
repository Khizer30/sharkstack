import { BadGatewayException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

interface SafepayTokenResponse {
  data?: unknown;
}

interface SafepayTransactionResponse {
  data?: { tracker?: { token?: string } };
}

export interface SafepayTransaction {
  userToken: unknown;
  trackerToken: string;
}

// Controls Safepay's checkout-page behavior. Must be one of Safepay's recognized values
// (hosted, popup, mobile, woocommerce, shopify) - anything else makes the /embedded/ page treat
// us as a WebView/iframe integration: it stops on /embedded/external/complete|error and waits for
// a parent wrapper to observe the URL change, instead of doing a real top-level browser redirect.
// We do a plain top-level redirect, so this must stay "hosted".
const CHECKOUT_SOURCE = "hosted";

// Free-form tag attached to tracker metadata only, for identifying this integration in the
// Safepay dashboard. Unrelated to checkout-page behavior, so it's fine to keep this custom.
const METADATA_SOURCE = "sharkstack-masterclass";

/**
 * Client for Safepay Pakistan's (getsafepay.com) hosted-checkout gateway.
 *
 * Flow:
 *   1. getUserToken()       POST /client/passport/v1/token   -> short-lived user token
 *   2. createTransaction()  POST /order/payments/v3/         -> tracker token
 *   3. attachOrderMetadata()  attaches our order id so the webhook can find it later
 *   4. buildCheckoutUrl()   the hosted /embedded/ page the customer is redirected to
 *   5. Safepay POSTs the result to our webhook - that is the ONLY authoritative
 *      source of payment status, never the browser redirect/cancel url.
 *
 * Endpoints, headers and the webhook signature scheme were verified against
 * Safepay's official open-source WooCommerce plugin
 * (github.com/getsafepay/safepay-checkout-woocommerce), since their public
 * REST docs don't cover every field.
 */
@Injectable()
export class SafepayService {
  private readonly logger = new Logger(SafepayService.name);

  constructor(private readonly configService: ConfigService) {}

  private get isProduction(): boolean {
    return this.configService.get<string>("SAFEPAY_MODE") === "production";
  }

  private get apiBaseUrl(): string {
    return this.isProduction ? "https://api.getsafepay.com" : "https://sandbox.api.getsafepay.com";
  }

  /** Host that serves the hosted /embedded/ checkout page (differs from the API host in production). */
  private get checkoutHost(): string {
    return this.isProduction ? "https://getsafepay.com" : "https://sandbox.api.getsafepay.com";
  }

  get isEnabled(): boolean {
    return Boolean(this.configService.get<string>("SAFEPAY_API_KEY") && this.configService.get<string>("SAFEPAY_SECRET_KEY"));
  }

  private authHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-SFPY-MERCHANT-SECRET": this.configService.get<string>("SAFEPAY_SECRET_KEY")!
    };
  }

  private transactionBody(input: { orderId: string; amountPkrCents: number }) {
    return {
      amount: input.amountPkrCents,
      intent: "CYBERSOURCE",
      mode: "payment",
      currency: "PKR",
      merchant_api_key: this.configService.get<string>("SAFEPAY_API_KEY"),
      order_id: input.orderId,
      source: CHECKOUT_SOURCE
    };
  }

  /** Step 1: exchange the merchant secret for a short-lived user token scoped to this order + amount (in paisas). */
  async getUserToken(input: { orderId: string; amountPkrCents: number }): Promise<unknown> {
    const res = await fetch(`${this.apiBaseUrl}/client/passport/v1/token`, {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify(this.transactionBody(input))
    });

    const data = (await res.json().catch(() => ({}))) as SafepayTokenResponse;
    if (res.status !== 200 && res.status !== 201) {
      this.logger.error(`Safepay token request failed: ${JSON.stringify(data)}`);
      throw new BadGatewayException("Could not start card payment.");
    }
    return data.data;
  }

  /** Step 2: creates the transaction/tracker for this order. Returns the tracker token used to build the checkout URL. */
  async createTransaction(input: { orderId: string; amountPkrCents: number }): Promise<string> {
    const res = await fetch(`${this.apiBaseUrl}/order/payments/v3/`, {
      method: "POST",
      headers: this.authHeaders(),
      body: JSON.stringify(this.transactionBody(input))
    });

    const data = (await res.json().catch(() => ({}))) as SafepayTransactionResponse;
    const trackerToken = data.data?.tracker?.token;
    if (res.status !== 201 || !trackerToken) {
      this.logger.error(`Safepay transaction request failed: ${JSON.stringify(data)}`);
      throw new BadGatewayException("Could not start card payment.");
    }
    return trackerToken;
  }

  /** Step 3: attaches our order id to the tracker so the webhook payload includes it. Non-fatal on failure. */
  async attachOrderMetadata(input: { trackerToken: string; orderId: string }): Promise<void> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/order/payments/v3/${input.trackerToken}/metadata`, {
        method: "POST",
        headers: this.authHeaders(),
        body: JSON.stringify({ data: { source: METADATA_SOURCE, order_id: input.orderId } })
      });
      if (!res.ok) {
        this.logger.warn(`Safepay metadata request returned ${res.status} for tracker ${input.trackerToken}`);
      }
    } catch (error) {
      this.logger.warn(`Safepay metadata request failed for tracker ${input.trackerToken}: ${error.message}`);
    }
  }

  /** Runs steps 1-3 together. */
  async startTransaction(input: { orderId: string; amountPkrCents: number }): Promise<SafepayTransaction> {
    const userToken = await this.getUserToken(input);
    const trackerToken = await this.createTransaction(input);
    await this.attachOrderMetadata({ trackerToken, orderId: input.orderId });
    return { userToken, trackerToken };
  }

  /** Builds the hosted-checkout redirect URL. Send the customer's browser here. */
  buildCheckoutUrl(input: { userToken: unknown; trackerToken: string; orderId: string; redirectUrl: string; cancelUrl: string }): string {
    const params = new URLSearchParams({
      tbt: String(input.userToken),
      tracker: input.trackerToken,
      order_id: input.orderId,
      environment: this.isProduction ? "production" : "sandbox",
      source: CHECKOUT_SOURCE,
      redirect_url: input.redirectUrl,
      cancel_url: input.cancelUrl
    });
    return `${this.checkoutHost}/embedded/?${params.toString()}`;
  }

  /**
   * Verifies the `x-sfpy-signature` header on incoming webhooks. Safepay signs
   * with HMAC-SHA512 over the raw JSON request body - the raw bytes must be
   * hashed as-is, never a re-serialized copy of the parsed body.
   */
  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
    if (!signatureHeader) return false;

    const secret = this.configService.get<string>("SAFEPAY_WEBHOOK_SECRET");
    if (!secret) {
      this.logger.error("SAFEPAY_WEBHOOK_SECRET is not configured.");
      return false;
    }

    const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    const expectedBuf = Buffer.from(expected, "utf8");
    const receivedBuf = Buffer.from(signatureHeader, "utf8");
    if (expectedBuf.length !== receivedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }
}
