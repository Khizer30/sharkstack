import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface CachedRate {
  rate: number;
  fetchedAt: number;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name);
  private cached: CachedRate | null = null;

  constructor(private readonly configService: ConfigService) {}

  async getUsdToPkrRate(): Promise<number> {
    if (this.cached && Date.now() - this.cached.fetchedAt < CACHE_TTL_MS) {
      return this.cached.rate;
    }

    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!res.ok) throw new Error(`Exchange rate API returned ${res.status}`);

      const data = (await res.json()) as { rates?: Record<string, number> };
      const rate = data.rates?.PKR;
      if (!rate) throw new Error("PKR rate missing from response");

      this.cached = { rate, fetchedAt: Date.now() };
      return rate;
    } catch (error) {
      this.logger.warn(`Falling back to configured USD->PKR rate: ${error.message}`);
      return Number(this.configService.get<string>("FALLBACK_USD_TO_PKR_RATE") ?? 280);
    }
  }

  /** Converts a USD amount in cents to PKR in paisas (both are x100 of their base unit, so the rate applies directly). */
  async convertUsdCentsToPkrCents(amountUsdCents: number): Promise<{ amountPkrCents: number; rate: number }> {
    const rate = await this.getUsdToPkrRate();
    const amountPkrCents = Math.round(amountUsdCents * rate);
    return { amountPkrCents, rate };
  }
}
