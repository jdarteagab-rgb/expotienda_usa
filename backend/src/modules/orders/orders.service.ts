import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

// Servicio con la lógica de negocio de las órdenes
@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Crea una orden a partir de un listado de productos, validando stock y tienda
  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { storeId, items } = createOrderDto;

    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException(`Tienda ${storeId} no existe`);

    // Transacción: se descuenta stock y se crea la orden de forma atómica
    return this.prisma.$transaction(async (prisma) => {
      let total = 0;
      const orderItems: { productId: number; quantity: number; price: number }[] = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Producto ${item.productId} no existe`);

        const price = Number(product.priceCOP);
        if (product.stock < item.quantity) {
          throw new ForbiddenException(`Stock insuficiente para ${product.name}`);
        }

        total += price * item.quantity;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: price,
        });

        // Descontamos del stock la cantidad pedida
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      }

      return prisma.order.create({
        data: {
          buyerId: userId,
          storeId,
          total,
          status: OrderStatus.PENDING,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
          buyer: { select: { id: true, name: true, email: true } },
          store: true,
        },
      });
    });
  }

  // Lista las órdenes hechas por el usuario, de la más reciente a la más antigua
  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: { items: { include: { product: true } }, store: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Devuelve una orden; solo el comprador o un ADMIN pueden verla
  async findOne(id: number, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        buyer: { select: { id: true, name: true, email: true } },
        store: true,
      },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no existe`);
    if (order.buyerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso');
    }
    return order;
  }

  // Lista las órdenes de una tienda; solo el dueño o un ADMIN pueden verlas
  async findStoreOrders(storeId: number, userId: number, userRole: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException(`Tienda ${storeId} no existe`);
    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso');
    }
    return this.prisma.order.findMany({
      where: { storeId },
      include: { items: { include: { product: true } }, buyer: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Actualiza el estado de una orden; solo el dueño de la tienda o un ADMIN
  async updateStatus(id: number, updateOrderDto: UpdateOrderDto, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { store: true },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no existe`);
    if (order.store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para actualizar esta orden');
    }
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: { items: { include: { product: true } } },
    });
  }

  // Cancela una orden: solo el comprador o un ADMIN, dentro de las primeras 2 horas
  // y siempre que la orden siga en estado PENDING. Devuelve el stock al inventario.
  async cancelOrder(id: number, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no existe`);
    if (order.buyerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Solo órdenes pendientes pueden cancelarse');
    }
    // Validación de 2 horas
    const now = new Date();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    if (now.getTime() - new Date(order.createdAt).getTime() > twoHoursInMs) {
      throw new ForbiddenException('El tiempo para cancelar ha expirado (2 horas)');
    }
    // Transacción: se restaura el stock y se marca la orden como cancelada
    return this.prisma.$transaction(async (prisma) => {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return prisma.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }
}
