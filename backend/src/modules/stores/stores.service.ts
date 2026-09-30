import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';

// Servicio con la lógica de tiendas
@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  // Lista todas las tiendas con su dueño y sus productos
  async findAll() {
    return this.prisma.store.findMany({
      include: { owner: true, products: true }
    });
  }

  // Busca una tienda por id; lanza excepción si no existe
  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: { owner: true, products: true }
    });

    if (!store) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }
    return store;
  }

  // Crea una tienda asociada al usuario; cada usuario solo puede tener una
  async create(createStoreDto: CreateStoreDto, ownerId: number) {
    const existingStore = await this.prisma.store.findUnique({
      where: { ownerId }
    });

    if (existingStore) {
      throw new ForbiddenException('Ya tienes una tienda creada');
    }

    return this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        ownerId: ownerId
      }
    });
  }

  // Actualiza una tienda; solo el dueño o un ADMIN pueden hacerlo
  async update(id: number, updateStoreDto: Partial<CreateStoreDto>, userId: number, userRole: string) {
    const store = await this.findOne(id);

    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para editar esta tienda');
    }

    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto
    });
  }

  // Elimina una tienda; solo el dueño o un ADMIN pueden hacerlo
  async remove(id: number, userId: number, userRole: string) {
    const store = await this.findOne(id);

    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para eliminar esta tienda');
    }

    return this.prisma.store.delete({
      where: { id }
    });
  }
}
