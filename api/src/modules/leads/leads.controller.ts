import { Controller, Post, Get, Body } from "@nestjs/common";
import { CreateLeadDto } from "@modules/leads/leads.dto";
import { LeadsService } from "@modules/leads/leads.service";

@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.leadsService.findAll();
  }
}
