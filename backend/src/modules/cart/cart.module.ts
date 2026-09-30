import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from '../../prisma/prisma.service';

// Módulo del carrito: agrupa su controlador, servicio y el acceso a datos
@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService],
})
export class CartModule {}
