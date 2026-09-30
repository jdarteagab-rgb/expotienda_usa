import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// Pruebas end-to-end para el AppController
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  // Antes de cada prueba se levanta la aplicación completa con el AppModule
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Se verifica que GET / responda 200 con el saludo esperado
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // Se cierra la aplicación al terminar cada prueba
  afterEach(async () => {
    await app.close();
  });
});
