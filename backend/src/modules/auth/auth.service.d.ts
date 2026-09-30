import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Declaración del servicio de autenticación
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);

    // Registra un usuario y devuelve el token junto con sus datos básicos
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;

    // Valida credenciales y devuelve el token junto con los datos del usuario
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;

    // Método interno para generar el JWT
    private generateToken;
}
//# sourceMappingURL=auth.service.d.ts.map
