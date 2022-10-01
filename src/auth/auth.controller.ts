import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRolesGuard } from './guards/user-roles.guard';
import { ValidRoles } from './interface/valid-roles';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')                                         // Ruta para renovar la validez/duración del token 
  @Auth()                                                      // 1º Validamos el token contra el usuario de la bd
  checkAuthStatus(                                             // 2º Renovamos validez del token con esta función que llama a un servicio 
    @GetUser() user: User                                      // Este servicio necesitará el usuario del token contenido en la petición ( request )
  ){
    return this.authService.checkAuthStatus( user )            // Se lo enviamos al servicio
  }

  @Get('private')
  @UseGuards(AuthGuard()) // Determinan si una solicitud dada será manejada por el controlador de ruta o no, dependiendo de las condiciones del jwtStrategy
                          // jwtStrategy determina si el payload de esta ruta se corresponde con un usuario de la bd registrado  
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,                    // Usamos un decorador personalizado para obtener el usuario del token
    @GetUser('email') userEmail: string,      // Usamos el mismo decorador para obtener un campo específico del usario del token
    @RawHeaders() rawHeaders: string[],       // Usamos un decorador personalizado para obtener los rawHeaders 
    @Headers() headers: IncomingHttpHeaders,  // Usamos un decorador de nest para obtener los headers de la petición
    ){  
    
    console.log({ request })

    return {
      ok:true, 
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
  
    }
  }
  
  @Get('private2')
  //@SetMetadata('roles', ['admin', 'super-user'])          // Asignamos al campo roles los valores permitidos, admin y super-user
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin )  // Usamos un decorador personalizado para hacer lo mismo pero sin variables "volátiles"
  @UseGuards(AuthGuard(), UserRolesGuard)                   // Validamos el token contra el usuario de la bd
  privateRoute2(
    @GetUser() user:User,                                   // Obtenemos el usuario 

  ){
    return {
      ok:true,
      user
    }
  }

  @Get('private3')
  @Auth()                                           // Usamos un composition Decorator que nos permite utilizar dos decoradores en uno
  privateRoute3(                                    // RoledProtected y UseGuards
    @GetUser() user: User,                          // Obtenemos el usuario 

  ) {
    return {
      ok: true,
      user
    }
  }
}
