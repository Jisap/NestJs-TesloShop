import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,                   // Variables de entorno
  ) {}

  @Get('product/:imageName')                                         // Función para obtener la imagen de un pto desde el nombre (uuid)
  findProductImage(                                                  // Para ello usa esta función que utiliza
    @Res() res: Response,                                            // @Res rompe el control de nest con la respuesta para hacerla manual nosotros mismos
    @Param('imageName') imageName:string                             // y @Params para obtener de los params de la url la 'imageName' (uuid)
  ){

    const path = this.filesService.getStaticProductImage(imageName); // con ese imageName y usando una función del filesService se obtiene el path
    
    return res.sendFile( path );                                     // Devolvemos el archivo según ese path  
  }



  @Post('product')                                              // Petición post a api/files/product para subida de un archivo
  @UseInterceptors(FileInterceptor('file', {                    // Interceptamos la petición de subida de archivos para modificar la respuesta sobre el archivo 'file'
    fileFilter: fileFilter,                                     // fileFilter recibe el file y evalua si tiene extension permitida y si no se seleccion nada como file
    storage: diskStorage({                                      // Si la extensión es permitida se procede a su almacenaje
      destination: './static/products',                         // en la carpeta '/static/products' 
      filename: fileNamer                                       // y su renombre del archivo con uuid
    })
  }) )                        
  uploadProductImage(                                           // Esta función recibe el file validado por extensión, renombrado por uuid y almacenado en fs
    @UploadedFile()                                             // Este decorador recibe el archivo subido y permite obtener su metadata
    file: Express.Multer.File                                    
     ){ 
      
    if( !file ){                                                              // Si se recibio un false del fileFilter por extensión no aceptada 
      throw new BadRequestException('Make sure that the file is an image')    // mensaje de error
    }

    // console.log({ file })
    const secureUrl = `${ this.configService.get('HOST_API')}/files/product/${ file.filename } }`; // Obtenida la metadata del file construimos la secureUrl que servirá 
                                                                                                   // para la bd del pto. Esta dirección es un endpoint para nuestro server
                                                                                                   // y usará el @Get('product/:imageName') de arriba.
    return { secureUrl }
  }
}
