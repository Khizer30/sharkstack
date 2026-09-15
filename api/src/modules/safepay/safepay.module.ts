import { Module } from "@nestjs/common";
import { ExchangeRateService } from "@modules/safepay/exchange-rate.service";
import { SafepayService } from "@modules/safepay/safepay.service";

@Module({
  providers: [SafepayService, ExchangeRateService],
  exports: [SafepayService, ExchangeRateService]
})
export class SafepayModule {}
