import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';

// Pruebas unitarias para el StoresService
describe('StoresService', () => {
  let service: StoresService;

  // Antes de cada prueba se crea el módulo de testing con el servicio
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoresService],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  // Verifica que el servicio se instancie correctamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
