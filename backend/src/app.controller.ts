import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Controlador raíz de la aplicación
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET / - devuelve un saludo básico para verificar que el servidor responde
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
