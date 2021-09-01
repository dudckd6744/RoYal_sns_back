import { User } from "src/modules/auth/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "../board.entity";

@Entity()
export class Reply extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(type => User)
    user: User;

    @Column()
    boardId: number;

    @Column()
    comment: string;

    @CreateDateColumn()
    createdAt: Date;
}