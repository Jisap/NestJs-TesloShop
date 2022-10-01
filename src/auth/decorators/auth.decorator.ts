import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../guards/user-roles.guard';
import { ValidRoles } from '../interface/valid-roles';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {

    return applyDecorators(
        RoleProtected( ...roles ),                      // Asignamos al campo roles los valores permitidos en ValidRoles[]
       
        UseGuards(AuthGuard(), UserRolesGuard),         // Validamos el token contra el usuario de la bd y que tenga los roles permitidos
        
    );
}

// Si Auth(ValidRoles.superUser) esta ruta solo se podría acceder con ese role