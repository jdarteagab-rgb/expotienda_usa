import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Módulo global de Prisma: al ser @Global, su servicio queda disponible en toda la app
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
