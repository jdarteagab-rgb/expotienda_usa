import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';

// Pruebas unitarias para el CartService
describe('CartService', () => {
  let service: CartService;

  // Antes de cada prueba se crea el módulo de testing con el servicio
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  // Verifica que el servicio se instancie correctamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
