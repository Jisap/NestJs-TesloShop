import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){ // Clase que recibe el payload y verifica que exista en bd
   
    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,                      // Inyección del modelo User en esta clase
        configService: ConfigService                                            // Usamos las variables de entorno 
    ){
        super({                                                                 // Necesitamos establecer las variables de la clase padre (PassportStrategy)
            secretOrKey: configService.get('JWT_SECRET'), 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }
    
    async validate( payload: JwtPayload ): Promise<User>{

        const { id } = payload;                                                      // Recibe el payload del jwt

        const user = await this.userRepository.findOneBy({ id });                    // Buscamos el usuario en Bd

        if( !user )                                                                     // Si no encontramos el usuario
            throw new UnauthorizedException( 'Token not valid' );                       // mensaje de error

        if( !user.isActive )                                                            // Si el usuario encontrado está inactivo
            throw new UnauthorizedException( 'User is inactive, talk with an admin');   // Mensaje de error

        return user                                                                     // Si si se encontró un usuario lo retornamos en la request
    }
}