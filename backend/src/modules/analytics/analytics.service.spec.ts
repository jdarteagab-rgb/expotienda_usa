import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';

// Pruebas unitarias para el AnalyticsService
describe('AnalyticsService', () => {
  let service: AnalyticsService;

  // Antes de cada prueba se crea el módulo de testing con el servicio
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  // Verifica que el servicio se instancie correctamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
