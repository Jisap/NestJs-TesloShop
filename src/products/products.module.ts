import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    TypeOrmModule.forFeature([    // importamos la entitie Product para que la maneje TypeOrmMOdule dentro de modulo de productos
      Product, ProductImage
    ]),
    AuthModule                    // importamos AuthModule para que solo pueda acceder a la rutas de ptos los usuarios registrados en bd
  ],
  exports:[
    ProductsService,              // Cualquiera que importe el productModule tendrá acceso al ProductService
    TypeOrmModule,                // Al exportar este modulo se exporta la configuracion del TypeOrmModule de product
  ] 
})
export class ProductsModule {}
