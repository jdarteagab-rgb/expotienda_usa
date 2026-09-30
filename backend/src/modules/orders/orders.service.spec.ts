import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

// Pruebas unitarias para el OrdersService
describe('OrdersService', () => {
  let service: OrdersService;

  // Antes de cada prueba se crea el módulo de testing con el servicio
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  // Verifica que el servicio se instancie correctamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
