import { Test, TestingModule } from '@nestjs/testing';
import { DistributorController } from './distributor.controller';

// Pruebas unitarias para el DistributorController
describe('DistributorController', () => {
  let controller: DistributorController;

  // Antes de cada prueba se prepara el módulo con el controlador
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributorController],
    }).compile();

    controller = module.get<DistributorController>(DistributorController);
  });

  // Verifica que el controlador se instancie correctamente
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
