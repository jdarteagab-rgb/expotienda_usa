import {Controller, Get, Post, Put, Delete, Body, Param} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

// Controlador CRUD de productos
@Controller('products')
export class ProductsController{

  constructor(private readonly productsService: ProductsService){}

  // GET /products - lista todos los productos
  @Get()
  async findAll(){
    return this.productsService.findAll();
  }

  // GET /products/:id - devuelve un producto por su id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // POST /products - crea un nuevo producto
  @Post()
  async create(@Body() createProductDto: CreateProductDto){
    return this.productsService.create(createProductDto);
  }

  // PUT /products/:id - actualiza parcialmente un producto existente
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto> ){
    return this.productsService.update(+id, updateProductDto);
  }

  // DELETE /products/:id - elimina un producto
  @Delete(':id')
  async remove(@Param('id') id: string){
    return this.productsService.remove(+id);
  }
}
