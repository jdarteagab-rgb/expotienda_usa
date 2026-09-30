import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

// Servicio con la lógica de productos
@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) {}

  // Lista todos los productos incluyendo los datos de su tienda
  async findAll() {
    return this.prisma.product.findMany({
      include: { store: true }
    });
  }

  // Busca un producto por id; lanza excepción si no existe
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { store: true }
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  // Crea un nuevo producto con los datos recibidos
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto
    });
  }

  // Actualiza un producto existente; solo toma en cuenta los campos enviados
  async update(id: number, updateProductDto: Partial<CreateProductDto>) {
    // Verificamos primero que el producto exista
    await this.findOne(id);

    // Filtramos los campos que vienen undefined para no sobrescribir datos
    const cleanData = Object.fromEntries(
      Object.entries(updateProductDto).filter(([_, v]) => v !== undefined)
    );

    return this.prisma.product.update({
      where: { id },
      data: cleanData,
    });
  }

  // Elimina un producto, validando primero que exista
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id }
    });
  }
}
