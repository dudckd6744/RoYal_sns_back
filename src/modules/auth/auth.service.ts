import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginUser } from './dto/user.create.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { signToken } from 'src/utils/utils.jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    registerUser(createUserDto: CreateUserDto): Promise<{message: string}> {
        return this.userRepository.registerUser(createUserDto);
    }

    async loginUser(loginUser:LoginUser): Promise<{token : string}> {
        const { email, password } = loginUser;
        const user = await this.userRepository.findOne({email})

        if(!user) throw new UnauthorizedException('해당 유저가 존재하지않습니다.');
        else if(await bcrypt.compare(password, user.password)){
            const email = user.email 
            const token = await signToken({email})
            
            return { token }
        }else{
            throw new UnauthorizedException('비밀번호를 다시 확인해주세요.');
        }
    }
}
