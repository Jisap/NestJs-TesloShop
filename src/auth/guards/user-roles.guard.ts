import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector){} // Reflector permite obtener la metadata personalizada establecida con setMetaData (Roles permitidos)

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler()) // Obtenemos los roles permitidos en la ruta

    if( !validRoles ) return true; 
    if( validRoles.length === 0 ) return true; 

    const req = context.switchToHttp().getRequest();                               // Obtenemos del context de la ruta toda la información de la petición 
    const user = req.user as User;                                                 // De la request obtenemos el usuario

    if( !user )
      throw new BadRequestException('Usuario no encontrado')

    for ( const role of user.roles){                                              // Iteramos el []roles del usuario de la bd
      if( validRoles.includes( role ) ){                                          // Si el role iterado esta incluido dentro de los roles permitidos
        return true;                                                              // devuelvo true y continua la ruta
      }
    }

    throw new ForbiddenException(`User ${ user.fullName } need a valid role: [${validRoles}]`)
  }
}
