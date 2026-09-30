import { Test, TestingModule } from '@nestjs/testing';
import { DistributorService } from './distributor.service';

// Pruebas unitarias para el DistributorService
describe('DistributorService', () => {
  let service: DistributorService;

  // Antes de cada prueba se crea el módulo de testing con el servicio
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistributorService],
    }).compile();

    service = module.get<DistributorService>(DistributorService);
  });

  // Verifica que el servicio se instancie correctamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
