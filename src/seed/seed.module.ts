import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from './../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductsModule, // Importando este modulo puedo acceder al productService desde el seed
    AuthModule      // Importando este módulo puedo acceder al Auth.decorators y proteger la ruta de seed
  ]
})
export class SeedModule {}
