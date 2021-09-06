import { BadRequestException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../auth/user.entity";
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/board.dto";
import { Like } from "./sections/like.entity";
import { Reply } from "./sections/reply.entity";
import { BoardStatus } from "./utils/board.status.enum";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board>{
    async createBoard(
        user: User,
        createBoardDto: CreateBoardDto,
        status: BoardStatus
    ): Promise<{message: string}> {
        const {title, description} = createBoardDto;
        
        const board = await this.create({
            userId: user.id,
            user,
            title,
            description,
            status
        })
        await this.save(board)

        return {message: 'success'}
    }

    async getBoard(
        search: string
    ): Promise<{board_count: number, boards: Board[]}> {
        const search_data = search ?? ""

        const board_count = await this.createQueryBuilder("board")
            .where("title like :searchTerm", {searchTerm: `%${search_data}%`})
            .getCount();

        const boards = await this.createQueryBuilder('board')
            .where("title like :searchTerm", {searchTerm: `%${search_data}%`})
            .leftJoinAndSelect("board.user", "user")
            .select([
                "board.id",
                "board.title",
                "board.description",
                "board.userId",
                "board.view",
                "board.like_count",
                "board.reply_count",
                "board.status",
                "board.IsLike",
                "user.name",
                "board.createdAt",
            ])
            .orderBy("board.createdAt","DESC")
            .getMany()
            
        return { board_count, boards }
    }
    
    async getDetailBoard(
        user: User,
        id: string
    ): Promise<Board> {
        const board = await this.createQueryBuilder('board')
            .where({id})
            .leftJoinAndSelect("board.user", "user")
            .select([
                "board.id",
                "board.title",
                "board.description",
                "board.userId",
                "board.view",
                "board.like_count",
                "board.reply_count",
                "board.status",
                "board.IsLike",
                "user.name",
                "board.createdAt",
            ])
            .getOne()

            if(!board) throw new BadRequestException("해당 게시글이 존재 하지않습니다.")

            if(user){
                board.view ++
                await this.save(board);
            }
            if(user){
                const like = await Like.findOne({userId:user.id , boardId:board.id});
                if(like){
                    board.IsLike = true
                }
            }
            return board
    }

    async updateBoard(
        user: User,
        id: string,
        creatreBoardDto: CreateBoardDto,
        status: BoardStatus
    ): Promise<{message: string}> {
        const {title, description} = creatreBoardDto
        
        const board = await this.findBoard(user, id)

        board.title = title
        board.description = description
        board.status = status

        await this.save(board)

        return {message: 'success'}
    }

    async deleteBoard(
        user: User,
        id: string
    ): Promise<{message: string}> {
        const board = await this.findBoard(user, id)

        await this.delete({id:board.id, userId:user.id})

        return {message: 'success'}
    }

    async like(
        user:User,
        id: string,
        parentId:string
    ): Promise<{message: 'success'}> {
        const parent_id = parentId ? parentId:null

        const board = await this.findOne(id)
        if(!board) throw new BadRequestException('해당 게시글이 존재 하지않습니다.')

        const liked = await Like.findOne({userId:user.id, boardId:board.id ,parentId:parent_id})
        if(liked) throw new BadRequestException('이미 좋아요 누른 게시글입니다.')

        const like = await Like.create({
            userId: user.id,
            user,
            boardId:board.id,
            board,
            parentId:parent_id
        })

        await Like.save(like)
        const reply = await Reply.findOne(parent_id)
        if(parent_id == reply.id){
            reply.like_count ++
            await Reply.save(reply)
        }else if(parent_id == null){
            board.like_count ++
            await this.save(board)
        }
        
        return {message: 'success'}
    }

    async unlike(
        user:User,
        id: string
    ): Promise<{message: 'success'}> {
        const board = await this.findOne(id)
        if(!board) throw new BadRequestException('해당 게시글이 존재 하지않습니다.')

        const liked = await Like.findOne({userId:user.id, boardId:board.id})
        if(!liked) throw new BadRequestException('이미 좋아요를 취소한 게시글입니다.')

        Like.delete({userId:user.id, boardId:board.id})

        board.like_count --
        await this.save(board)
        
        return {message: 'success'}
    }

    private async findBoard(user, id){
        const board = await this.findOne(id);

        if(!board) throw new BadRequestException('해당 게시글이 존재 하지않습니다.')
        else if(board.userId != user.id) throw new BadRequestException('사용자 게시글이 아닙니다.')

        return board
    }
}