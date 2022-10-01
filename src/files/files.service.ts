import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {
  
    getStaticProductImage( imageName: string ){                             // Recibe el nombre de la imagen
        const path = join( __dirname, '../../static/products', imageName ); // path para la imagen
    

    if ( !existsSync( path ) )                                              // Si no existe la imagen en el path
        throw new BadRequestException(`No product found, ${ imageName }`)   // mensaje de error
    
    return path                                                             // Pero si existe devolvemos el path al controller
    }
}
