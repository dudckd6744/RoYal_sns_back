import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//모델
import { Board, BoardSchema } from 'src/schemas/Board';
import { Like, LikeSchema } from 'src/schemas/Like';
import { Reply, ReplySchema } from 'src/schemas/Reply';
import { Tag, TagSchema } from 'src/schemas/Tag';
import { User, UserSchema } from 'src/schemas/User';

import { BoardController } from './board.controller';
import { BoardRepository } from './board.repository';
import { BoardService } from './board.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }]),
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    ],
    controllers: [BoardController],
    providers: [BoardService, BoardRepository],
})
export class BoardModule {}
