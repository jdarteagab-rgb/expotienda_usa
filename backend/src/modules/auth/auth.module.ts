import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

// Módulo de autenticación: configura JWT, Passport y registra sus providers
@Module({
  imports: [
    PassportModule,
    // Configuramos el módulo JWT con el secret y el tiempo de expiración desde variables de entorno
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        // Se castea a any porque expiresIn espera un tipo específico y el valor viene como string
        expiresIn: process.env.JWT_EXPIRES_IN as any
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
