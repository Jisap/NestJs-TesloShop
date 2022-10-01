import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interface/valid-roles';

export const META_ROLES = 'roles'                           // Asignamos al campo roles los valores permitidos en ValidRoles[]

export const RoleProtected = (...args: ValidRoles[]) => {
    
    return SetMetadata( META_ROLES, args );

}

