import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

// Módulo de tiendas: agrupa su controlador y servicio
@Module({
  controllers: [StoresController],
  providers: [StoresService]
})
export class StoresModule {}
