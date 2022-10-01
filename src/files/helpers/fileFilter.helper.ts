import { Request } from "express";


export const fileFilter = ( req:Request, file: Express.Multer.File, callback: Function ) => {

    if ( !file ) return callback( new Error( 'File is empty' ), false ); // Si no hay archivo el cb devuelve un error y un false como no aceptada la operación en el controller

    const fileExtension = file.mimetype.split( '/' )[1];
    const validExtension = ['jpg','jpeg','png','gif'];

    if( validExtension.includes( fileExtension ) ){                      // Si la extensión del archivo esta entre las permitidas
        callback( null, true )                                           // El cb devolverá al controller que no hay errores y un true para que siga adelante.
    }

    callback( null, false )                                              // En caso contrario, la extensión no esta entre las permitidas devolveremos null y false para que no continue.
}