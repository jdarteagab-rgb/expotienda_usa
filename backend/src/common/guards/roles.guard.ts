import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Guard que valida si el usuario tiene el rol requerido para acceder a una ruta
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Se leen los roles definidos con el decorador @Roles en el handler
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // Si la ruta no tiene roles asignados, se permite el acceso
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se verifica que el rol del usuario esté entre los permitidos
    return roles.includes(user?.role);
  }
}
