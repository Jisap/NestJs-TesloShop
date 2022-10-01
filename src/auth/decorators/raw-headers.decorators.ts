import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const RawHeaders = createParamDecorator( // Obtenemos los params (path, querys, token) de la url que definen un contexto
    // data son los param dentro del decorador
    (data: string, ctx: ExecutionContext) => {         // Definimos un cb en base a un contexto que contiene toda petición (request)

        const req = ctx.switchToHttp().getRequest();    // Obtenemos la request
        const rawHeaders = req.rawHeaders;              // De la request obtenemos los rawHeaders
        

        if (!rawHeaders)
            throw new InternalServerErrorException('User not found (request)')

             
        return rawHeaders
    }
)