import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images'})
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    // Relación
    // Un conjunto de imagenes pueden pertenecer a un solo pto
    @ManyToOne(
        () => Product,                          // cada campo de product devolverá una entidad Product 
        ( product ) => product.images,          // y este tendrá unas product.images []
        { onDelete: 'CASCADE' }
    )
    product: Product
}