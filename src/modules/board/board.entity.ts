import { BaseEntity, Column, CreateDateColumn, Entity, IsNull, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";
import { BoardStatus } from "./utils/board.status.enum";

@Entity()
export class Board extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(type => User)
    user: User;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({default:"PUBLIC"})
    status: BoardStatus;

    @Column({default: 0})
    view: number;

    @Column({default: 0})
    like: number;

    @Column({default: 0})
    reply: number;

    @Column({default: false})
    IsLike: boolean;

    @CreateDateColumn()
    createdAt: Date;
}