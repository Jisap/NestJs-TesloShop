import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const GetUser = createParamDecorator( // Obtenemos los params (path, querys, token) de la url que definen un contexto
// data son los param dentro del decorador
    ( data:string, ctx: ExecutionContext ) => {         // Definimos un cb en base a un contexto que contiene toda petición (request)
        
        const req = ctx.switchToHttp().getRequest();    // Obtenemos la request
        const user = req.user;                          // De la request obtenemos el usuario
        const email = req.email;

        if(!user) 
            throw new InternalServerErrorException('User not found (request)')

        return ( !data ) ? user : user[data]; // Si el decorador no tiene ningún parámetro devolvemos el usuario
                                              // Pero si si lo tiene devolvemos la prop de usuario correspondiente a ese parámetro          
    
    }
)