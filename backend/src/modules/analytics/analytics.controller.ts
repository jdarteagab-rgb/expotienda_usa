// Importamos los decoradores y utilidades necesarias de NestJS
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
// Importamos el guard de autenticación basado en Passport
import { AuthGuard } from '@nestjs/passport';
// Importamos el servicio que contiene la lógica de analítica
import { AnalyticsService } from './analytics.service';
// Importamos el guard que valida los roles del usuario
import { RolesGuard } from '../../common/guards/roles.guard';
// Importamos el decorador personalizado para asignar roles permitidos
import { Roles } from '../../common/decorators/roles.decorator';

// Definimos el controlador y su ruta base "/analytics"
@Controller('analytics')
// Aplicamos los guards a nivel de controlador: primero valida el JWT y luego los roles
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnalyticsController {
  // Inyectamos el servicio de analítica por el constructor
  constructor(private analyticsService: AnalyticsService) {}

  // Endpoint GET para obtener el resumen de ventas
  @Get('sales-overview')
  // Solo los usuarios con rol ADMIN o DISTRIBUIDOR pueden acceder
  @Roles('ADMIN', 'DISTRIBUIDOR')
  async getSalesOverview(@Request() req, @Query('storeId') storeId?: string) {
    // Llamamos al servicio pasando el id del usuario, su rol y el storeId opcional
    // (convertimos storeId a número si viene en la query)
    return this.analyticsService.getSalesOverview(
      req.user.userId,
      req.user.role,
      storeId ? parseInt(storeId) : undefined,
    );
  }
}
