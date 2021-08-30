import { User } from "src/modules/auth/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "../board.entity";


@Entity()
export class Like extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(type => User)
    user: User;

    @Column()
    boardId: number;

    @ManyToOne(type => Board)
    board: Board;

    @CreateDateColumn()
    createdAt: Date;
}