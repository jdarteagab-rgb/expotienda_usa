import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

// Pruebas unitarias para el OrdersController
describe('OrdersController', () => {
  let controller: OrdersController;

  // Antes de cada prueba se prepara el módulo con el controlador
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  // Verifica que el controlador se instancie correctamente
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
