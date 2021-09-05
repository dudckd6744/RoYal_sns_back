import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
 
    @CreateDateColumn()
    createdAt: Date
}