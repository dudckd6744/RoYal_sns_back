import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column()
    type: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({nullable:true})
    password: string;

    @Column({nullable:true})
    profile: string;
 
    @CreateDateColumn()
    createdAt: Date
}