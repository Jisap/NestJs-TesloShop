import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)                               // El módulo AuthService trabaja con instancias del modelo User
    private readonly userRepository:Repository<User>,     // Las instancias son los userRepository y los modelos las entities
    private readonly jwtService: JwtService               // Servicio de @nestjs/jwt que proviene asu vez de AuthModule 
  ) { }                                                   // Permite la creación de un jwt según una configuración establecida en dicho módulo

    async create(createUserDto: CreateUserDto) {
    
    try {
      const { password, ...userData } = createUserDto;          // Extraemos del dto la password
      const user = this.userRepository.create({                 // Creamos un usuario en una instancia del modelo con el contenido del dto
        ...userData,                                            // El dto se compondrá de los datos del usuario
        password: bcrypt.hashSync( password, 10 )               // y de la password encryptada
       })   
      await this.userRepository.save( user )                    // Cuando se haya creado lo grabamos en bd
      delete user.password;                                     // De la respuesta al frontend borramos la password
      return { ...user,                                         // retornamos el resto de datos.
       token: this.getJwtToken({ id: user.id })                 // con el token basado en el id del usuario
      }

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async checkAuthStatus( user: User ){
    return {
      ...user,                                                 // Spread del user
      token: this.getJwtToken({ id: user.id })                 // generamos un nuevo token basado en el id del usuario
    }
  }





  private getJwtToken( payload: JwtPayload ){                   // Función para la generación de un Jwt
    const token = this.jwtService.sign( payload );              // jwtService proviene de @nest/jwt y este de AuthModule que contiene el secret y la exp
    return token;
  }


  async login( loginUserDto:LoginUserDto ){

    
      const { password, email } = loginUserDto;                                   // email y pass del dto
      const user = await this.userRepository.findOne({                            // Buscamos el user en las instancias de usuarios en bd
        where: { email },                                                         // la condición es que el email debe ser el que se proporciono en el dto
        select: { email:true, password: true, id:true }                           // y mostramos el email y password y el id ( por defecto pass e id no se mostraba )
      });

      if( !user )                                                                 // Si el usuario no existe en bd
        throw new UnauthorizedException('Credentials are not valid (email)')      // mensaje de error
      
      if( !bcrypt.compareSync( password, user.password))                          // Si el usuario si existe pero la pass no coincide con la de la bd
        throw new UnauthorizedException('Credentials are not valid (password)')   // mensaje de error

      return{ 
        ...user,
        token: this.getJwtToken({ id: user.id })
      } 
      

    
  }



  private handleDBErrors( error: any ): never {

    if( error.code === '23505' )
      throw new BadRequestException( error.detail )
    
    console.log( error )

    throw new InternalServerErrorException( 'PLease check server logs')
  }
}
