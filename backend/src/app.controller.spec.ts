import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Pruebas unitarias para el AppController
describe('AppController', () => {
  let appController: AppController;

  // Antes de cada prueba se crea el módulo con el controlador y su servicio
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // Se verifica que la ruta raíz devuelva el saludo esperado
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
