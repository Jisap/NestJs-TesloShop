import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');           // Ruta ppal de la API

  app.useGlobalPipes(                   // Validaciones globales
    new ValidationPipe({
      whitelist: true,                  // Solo muestra la data que estoy esperando en el dto
      forbidNonWhitelisted: true,       // Si viene un parametro que no esta en el whitelist, se lanza un error
    })
  );

  const config = new DocumentBuilder()                          // Configuración para el modulo de Swagger que permite
    .setTitle('Teslo RESTFul API')                              // describir nuestro APIrestfull 
    .setDescription('The Teslo Shop endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${ process.env.PORT }`)
}
bootstrap();
