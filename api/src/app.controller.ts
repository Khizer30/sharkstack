import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHealthRoot() {
    return {
      timestamp: new Date().toISOString()
    };
  }

  @Get("health")
  getHealth() {
    return {
      timestamp: new Date().toISOString()
    };
  }
}
