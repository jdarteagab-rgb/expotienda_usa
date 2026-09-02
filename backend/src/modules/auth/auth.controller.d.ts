/**
 * Declaraciones de tipos del AuthController.
 * Contiene solo las firmas (no la implementación).
 */
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/** Controlador de autenticación (registro y login). */
export declare class AuthController {
    /** Servicio de autenticación inyectado. */
    private readonly authService;

    constructor(authService: AuthService);

    /** Registra un usuario y devuelve token + datos básicos. */
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;

    /** Inicia sesión y devuelve token + datos del usuario. */
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map
