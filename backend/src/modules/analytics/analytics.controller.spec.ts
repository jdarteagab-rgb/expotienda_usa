// Importamos las utilidades de testing que ofrece NestJS
import { Test, TestingModule } from '@nestjs/testing';
// Importamos el controlador que vamos a probar
import { AnalyticsController } from './analytics.controller';

// Bloque de pruebas para el AnalyticsController
describe('AnalyticsController', () => {
  // Variable donde guardaremos la instancia del controlador
  let controller: AnalyticsController;

  // Antes de cada prueba, preparamos el módulo de testing
  beforeEach(async () => {
    // Creamos un módulo de prueba que solo incluye el controlador
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
    }).compile();

    // Obtenemos la instancia del controlador desde el módulo
    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  // Verificamos que el controlador se haya creado correctamente
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
