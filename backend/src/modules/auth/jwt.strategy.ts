import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Se toma el secret desde las variables de entorno, con uno por defecto como respaldo
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_por_defecto';

// Estrategia JWT que Passport usará para autenticar las peticiones
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token del header Authorization como "Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Rechaza tokens expirados
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  // Se ejecuta cuando el token es válido; lo que retorna queda en req.user
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
