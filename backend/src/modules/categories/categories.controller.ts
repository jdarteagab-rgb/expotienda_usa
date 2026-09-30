import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

// Controlador para consultar las categorías de productos
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET /categories - devuelve todas las categorías
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
}
