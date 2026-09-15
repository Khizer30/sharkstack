import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import type { RawBodyRequest } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request } from "express";
import { CreateInterneeDto } from "@modules/internees/internees.dto";
import { InterneesService } from "@modules/internees/internees.service";
import { SafepayService } from "@modules/safepay/safepay.service";

@Controller("internees")
export class InterneesController {
  constructor(
    private readonly interneesService: InterneesService,
    private readonly safepayService: SafepayService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("resume"))
  async create(@Body() dto: CreateInterneeDto, @UploadedFile() file?: Express.Multer.File) {
    return this.interneesService.create(dto, file);
  }

  @Get()
  async findAll() {
    return this.interneesService.findAll();
  }

  @Get(":id/payment-status")
  async paymentStatus(@Param("id") id: string) {
    return this.interneesService.getPaymentStatus(id);
  }

  @Post("payment/webhook")
  @HttpCode(200)
  async handleSafepayWebhook(@Req() req: RawBodyRequest<Request>) {
    const rawBody = req.rawBody;
    const signature = req.headers["x-sfpy-signature"] as string | undefined;

    if (!rawBody || !this.safepayService.verifyWebhookSignature(rawBody, signature)) {
      throw new BadRequestException("Invalid webhook signature");
    }

    await this.interneesService.handleSafepayWebhook(JSON.parse(rawBody.toString("utf8")));
    return { received: true };
  }
}
