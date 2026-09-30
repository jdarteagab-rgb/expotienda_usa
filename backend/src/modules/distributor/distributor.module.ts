import { Module } from '@nestjs/common';
import { DistributorController } from './distributor.controller';
import { DistributorService } from './distributor.service';
import { PrismaService } from '../../prisma/prisma.service';

// Módulo del distribuidor: agrupa su controlador, servicio y acceso a datos
@Module({
  controllers: [DistributorController],
  providers: [DistributorService, PrismaService],
})
export class DistributorModule {}
