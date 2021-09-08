import { User } from 'src/modules/auth/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../board.entity';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne((type) => User)
  user: User;

  @Column()
  boardId: string;

  @ManyToOne((type) => Board)
  board: Board;

  @Column({ nullable: true })
  parentId: string;

  @CreateDateColumn()
  createdAt: Date;
}
