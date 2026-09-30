import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { AuthGuard } from '@nestjs/passport';

// Controlador de tiendas
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // GET /stores - lista todas las tiendas
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  // GET /stores/:id - devuelve una tienda por su id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  // POST /stores - crea una tienda (requiere estar autenticado)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    // Se usa el userId del token para asociar la tienda al usuario
    return this.storesService.create(createStoreDto, req.user.userId);
  }

  // PUT /stores/:id - actualiza una tienda existente
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateStoreDto: Partial<CreateStoreDto>, @Request() req) {
    return this.storesService.update(+id, updateStoreDto, req.user.userId, req.user.role);
  }

  // DELETE /stores/:id - elimina una tienda
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Request() req: any) {
      return this.storesService.remove(+id, req.user.userId, req.user.role);
  }
}
