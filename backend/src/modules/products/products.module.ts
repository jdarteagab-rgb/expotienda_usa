import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma/prisma.service';

// Módulo de productos: agrupa su controlador, servicio y acceso a datos
@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
