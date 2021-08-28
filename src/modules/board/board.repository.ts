import { BadRequestException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../auth/user.entity";
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/board.dto";
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
                "board.like",
                "user.name",
                "board.createdAt",
            ])
            .orderBy("board.createdAt","DESC")
            .getMany()

        return { board_count, boards }
    }
    
    async getDetailBoard(
        user: User,
        id: number
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
                "board.like",
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
            return board
    }
}