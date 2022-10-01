// Las entities son una representación del objeto Product en nuestra bd
// Basicamente representa una tabla de la base de datos con sus definciones y tipos.

import { User } from "../../auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({ 
        example: '801bd6f6-6650-4f14-9011-31bdfc7d16be',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')     // id
    id: string;                         // string

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text',{                    // 1º columna tipo text
        unique: true,                   // Única
    })
    title: string;                      // string

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float',{
        default:0
    })
    price: number;

    @ApiProperty({
        example: 'lorem ipsum Anim reprehenderit nulla in anim mollit irure commodo.',
        description: 'Product description',
        default: null,
    })
    @Column({
        type:'text',
        nullable: true
    })
    description:string;

    @ApiProperty({
        example: 'T_Shirt_Teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    slug:string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock:number;

    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product sizes',
    })
    @Column('text',{
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    // Relación
    // Un pto puede tener muchas imagenes
    @ApiProperty()
    @OneToMany(
        () => ProductImage,                                                 // Cada campo images devolverá un ProductImage[]
        ( productImage ) => productImage.product,                           // y cada una pertenecerá a un producto
        { cascade: true, eager: true }                                      // eager permite cargar las relaciones cuando se usa find*()
    )
    images?:ProductImage[]

    // Relación
    // Muchos productos serán creados por un único usuario ( ManyToOne )
    @ManyToOne(
        () => User,                                                         // Cada campo user devolvera un único usuario
        ( user ) => user.product,                                            // Ese usuario pertenecerá a un producto.    
        { eager : true }
    )
    user: User

    @BeforeInsert()                                                         // Antes de la inserción en la bd
    checkSlugInsert(){                                                      // Llamamos a este método que verifica que  
        if( !this.slug ){                                                   // sino existe el slug en el body
            this.slug = this.title                                          // usamos el title como slug
        }
                                                                            
        this.slug = this.slug                                               // Si el slug existe entonces
            .toLowerCase()                                                  // lo pasamos a minúsculas
            .replaceAll(' ', '_')                                           // y sustituimos los espacios por _
            .replaceAll("´", '')                                            // y eliminamos los ´
    }

    @BeforeUpdate()                                                         // Despues de la actualización en bd
    checkSlugUpdate(){                                                      // Llamamos a este otro método que verifica que
        this.slug = this.slug                                               // el slug existe
            .toLowerCase()                                                  // lo pasamos a minúsculas
            .replaceAll(' ','_')                                            // sustituimos los espacios por _
            .replaceAll("´", '')                                            // y eliminamos los ´
    }
}
