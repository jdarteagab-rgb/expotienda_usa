import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DistributorService } from './distributor.service';

// Controlador para las funciones del rol distribuidor; requiere JWT
@Controller('distributor')
@UseGuards(AuthGuard('jwt'))
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  // GET /distributor/metrics - devuelve las métricas de la tienda del distribuidor
  @Get('metrics')
  async getMetrics(@Request() req) {
    return this.distributorService.getMetrics(req.user.userId);
  }

  // GET /distributor/products - lista los productos de su tienda
  @Get('products')
  async getMyProducts(@Request() req) {
    return this.distributorService.getMyProducts(req.user.userId);
  }

  // GET /distributor/orders - lista las órdenes recibidas en su tienda
  @Get('orders')
  async getMyStoreOrders(@Request() req) {
    return this.distributorService.getMyStoreOrders(req.user.userId);
  }

  // GET /distributor/store - devuelve la información de su tienda
  @Get('store')
  async getMyStore(@Request() req) {
    return this.distributorService.getStoreByUserId(req.user.userId);
  }
}
