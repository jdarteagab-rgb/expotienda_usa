import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

// Controlador del carrito de compras, requiere estar autenticado con JWT
@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // GET /cart - devuelve el carrito del usuario autenticado
  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  // POST /cart/add - agrega un producto al carrito
  @Post('add')
  addItem(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addItem(req.user.userId, addToCartDto);
  }

  // PUT /cart/item/:itemId - actualiza la cantidad de un ítem del carrito
  @Put('item/:itemId')
  updateItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.userId, +itemId, updateCartItemDto.quantity);
  }

  // DELETE /cart/item/:itemId - elimina un ítem específico del carrito
  @Delete('item/:itemId')
  removeItem(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.userId, +itemId);
  }

  // DELETE /cart/clear - vacía por completo el carrito
  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }

  // POST /cart/checkout - convierte el carrito en una orden de compra
  @Post('checkout')
  checkout(@Request() req) {
    return this.cartService.checkout(req.user.userId);
  }
}
