import { Injectable } from '@nestjs/common';

import {
    CreateUserDto,
    LoginUser,
    PasswordUserDto,
} from './dto/user.create.dto';
import { AuthRepository } from './auth.repository';
import { User } from 'src/schemas/User';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    registerUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
        return this.authRepository.registerUser(createUserDto);
    }

    async loginUser(loginUser: LoginUser): Promise<{ token: string }> {
        return this.authRepository.loginUser(loginUser);
    }

    passwordUpdateUser(
        email: string,
        passwordUserDto: PasswordUserDto,
    ): Promise<{ message: string }> {
        return this.authRepository.passwordUpdateUser(email, passwordUserDto);
    }

    async googleLogin(req,res) {
        return this.authRepository.googleLogin(req,res);
    }

    async kakaoLogin(req) {
        return this.authRepository.kakaoLogin(req);
    }

    followUser(user: User, othersId:string): Promise<{message: string}> {
        return this.authRepository.followUser(user, othersId)
    }

    unfollowUser(user: User, othersId:string): Promise<{message: string}> {
        return this.authRepository.unfollowUser(user, othersId)
    }
}
