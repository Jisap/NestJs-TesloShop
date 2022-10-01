import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';


@Module({
  imports: [
    ConfigModule.forRoot(), // Nos permite cargar las variables de entorno desde un ConfigModule
    
    TypeOrmModule.forRoot({  // Un ORM nos ayuda en la extracción de código complejo SQL, 
      ssl: process.env.STAGE === 'prod' ? true: false,
      extra: { 
        ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,  // Las variables de entorno son todas strings, con un + las convertimos a número
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }), 

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public') // Definimos el path para una carpeta public en nuestro root
    }),
    
    ProductsModule, 
    CommonModule,
    SeedModule, 
    FilesModule,
    AuthModule,
    MessagesWsModule,
  ],
})
export class AppModule {}
