import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';

// Pruebas unitarias para el CartController
describe('CartController', () => {
  let controller: CartController;

  // Antes de cada prueba se prepara el módulo con el controlador
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  // Verifica que el controlador se instancie correctamente
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
