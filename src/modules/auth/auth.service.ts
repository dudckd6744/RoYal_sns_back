import { Injectable } from '@nestjs/common';

import {
    CreateUserDto,
    LoginUser,
    PasswordUserDto,
} from './dto/user.create.dto';
import { AuthRepository } from './auth.repository';
import { User } from 'src/schemas/User';
import { Response } from 'express';

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
        user: User,
        passwordUserDto: PasswordUserDto,
    ): Promise<{ message: string }> {
        return this.authRepository.passwordUpdateUser(user, passwordUserDto);
    }

    async googleLogin(req,res) {
        return this.authRepository.googleLogin(req,res);
    }

    async kakaoLogin(req, res:Response) {
        return this.authRepository.kakaoLogin(req, res);
    }

    followUser(user: User, othersId:string): Promise<{message: string}> {
        return this.authRepository.followUser(user, othersId)
    }

    unfollowUser(user: User, othersId:string): Promise<{message: string}> {
        return this.authRepository.unfollowUser(user, othersId)
    }
}
