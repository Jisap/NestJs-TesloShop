import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators'
import { ValidRoles } from '../auth/interface/valid-roles';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products')                                                                                // Permite agrupar los endpoints por products en swagger
@Controller('products')                                                                     
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()                                                             // Validamos el token contra el usuario de la bd 
  @ApiResponse({ status: 201, description: 'Product was created',type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Forbidden - Token related' })
  create(
    @Body() createProductDto: CreateProductDto,  
    @GetUser() user: User
    ) {
    return this.productsService.create(createProductDto , user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {                    // Extraemos los query params del url -> paginationDto
    console.log(paginationDto)
    return this.productsService.findAll( paginationDto );             // Llamamos a findAll con esos query Params
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)                                             // Validamos el token contra el usuario de la bd y que el rol sea 'admin
  update(
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
    ){
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)                                             // Validamos el token contra el usuario de la bd y que el rol sea 'admin
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
