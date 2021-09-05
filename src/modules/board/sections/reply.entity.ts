import { User } from "src/modules/auth/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "../board.entity";

@Entity()
export class Reply extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(type => User)
    user: User;

    @Column()
    boardId: string;

    @Column()
    comment: string;

    @Column()
    parentId: string;

    @CreateDateColumn()
    createdAt: Date;
}