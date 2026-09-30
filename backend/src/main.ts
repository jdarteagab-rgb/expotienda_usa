import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Punto de entrada de la aplicación: crea el servidor y lo pone a escuchar
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Se toma el puerto desde las variables de entorno, con 3001 por defecto
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
