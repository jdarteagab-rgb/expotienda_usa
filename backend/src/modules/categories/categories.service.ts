import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Servicio con la lógica de categorías
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Devuelve todas las categorías ordenadas por nombre,
  // incluyendo el conteo de productos asociados a cada una
  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }
}
