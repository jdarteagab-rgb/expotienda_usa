import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

// Controlador de órdenes; todas las rutas requieren autenticación JWT
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {

    constructor(private readonly ordersService: OrdersService){}

    // POST /orders - crea una nueva orden para el usuario autenticado
    @Post()
    create(@Request() req, @Body() createOrderDto: CreateOrderDto){
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    // GET /orders/my - lista las órdenes del usuario autenticado
    @Get('my')
    findMyOrders(@Request() req){
        return this.ordersService.findMyOrders(req.user.userId);
    }

    // GET /orders/store/:storeId - lista las órdenes de una tienda específica
    @Get('store/:storeId')
    findStoreOrders(@Param('storeId') storeId: string, @Request() req){
        return this.ordersService.findStoreOrders(+storeId, req.user.userId, req.user.role);
    }

    // GET /orders/:id - devuelve una orden puntual validando permisos
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.ordersService.findOne(+id, req.user.userId, req.user.role);
    }

    // PUT /orders/:id/status - actualiza el estado de una orden
    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Request() req) {
        return this.ordersService.updateStatus(+id, updateOrderDto, req.user.userId, req.user.role);
    }

    // PUT /orders/:id/cancel - cancela una orden
    @Put(':id/cancel')
    cancelOrder(@Param('id') id: string, @Request() req) {
        return this.ordersService.cancelOrder(+id, req.user.userId, req.user.role);
    }
}
