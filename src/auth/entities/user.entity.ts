import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { 
        unique: true
    })
    email:string;

    @Column('text',{
        select: false // En las operaciones de busqueda y querybuilder el rdo de la password no aparecerá
    })
    password:string;

    @Column('text')
    fullName:string;

    @Column('bool',{
        default: true
    })
    isActive:boolean;

    @Column('text', { 
        array: true,
        default:['user']
    })
    roles: string[];

    // Relación
    // Un usuario puede crear muchos productos OneToMany
    @OneToMany(
        () => Product,                               // Cada campo product devolverá un Product[]
        ( product ) => product.user                  // y cada elemento de Product[] pertenecerá a un usuario   
    )
    product: Product

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }
    
    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

}
