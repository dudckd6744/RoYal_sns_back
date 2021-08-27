import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../auth/user.entity";


@Entity()
export class Board extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number

    @ManyToOne(type => User)
    user: User

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column({default: 0})
    like: number;

    @Column({default: false})
    IsLike: boolean;
}