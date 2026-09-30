import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

// Servicio con la lógica del carrito de compras
@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Busca el carrito del usuario o lo crea si no existe
  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  async getCart(userId: number) {
    return this.getOrCreateCart(userId);
  }

  // Agrega un producto al carrito; valida que exista y que haya stock suficiente
  async addItem(userId: number, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Producto ${productId} no existe`);
    }
    if (product.stock < quantity) {
      throw new ForbiddenException(`Stock insuficiente. Disponible: ${product.stock}`);
    }

    const cart = await this.getOrCreateCart(userId);

    // Revisamos si el producto ya estaba en el carrito para sumar la cantidad
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }
  }

  // Actualiza la cantidad de un ítem; si la cantidad es 0 o menos, lo elimina
  async updateItem(userId: number, itemId: number, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: { product: true },
    });

    if (!item) {
      throw new NotFoundException(`Item ${itemId} no encontrado en tu carrito`);
    }

    if (quantity <= 0) {
      return this.prisma.cartItem.delete({ where: { id: itemId } });
    }

    if (item.product.stock < quantity) {
      throw new ForbiddenException(`Stock insuficiente. Disponible: ${item.product.stock}`);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  }

  // Elimina un ítem específico del carrito del usuario
  async removeItem(userId: number, itemId: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item ${itemId} no encontrado en tu carrito`);
    }

    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  // Vacía todos los ítems del carrito
  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  // Convierte el carrito en una orden: valida stock, descuenta inventario y crea la orden
  async checkout(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new ForbiddenException('El carrito está vacío');
    }

    // Verificamos que todos los productos tengan stock antes de continuar
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new ForbiddenException(
          `Stock insuficiente para ${item.product.name}. Disponible: ${item.product.stock}`
        );
      }
    }

    // Usamos una transacción para asegurar que todo se guarde junto o nada se guarde
    return this.prisma.$transaction(async (prisma) => {
      const storeId = cart.items[0].product.storeId;
      let total = 0;
      const orderItems: { productId: number; quantity: number; price: number }[] = [];

      // Recorremos los ítems: calculamos el total, descontamos stock y armamos el detalle
      for (const item of cart.items) {
        const price = Number(item.product.priceCOP);
        total += price * item.quantity;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price,
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: item.product.stock - item.quantity },
        });
      }

      // Creamos la orden con sus ítems asociados
      const order = await prisma.order.create({
        data: {
          buyerId: userId,
          storeId,
          total,
          status: 'PENDING',
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });

      // Vaciamos el carrito después de generar la orden
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }
}
