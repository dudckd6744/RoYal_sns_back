import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/schemas/User';

import { AuthRepository } from './auth.repository';
import {
    CreateUserDto,
    LoginUser,
    PasswordUserDto,
} from './dto/user.create.dto';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    registerUser(createUserDto: CreateUserDto) {
        return this.authRepository.registerUser(createUserDto);
    }

    async loginUser(loginUser: LoginUser) {
        return this.authRepository.loginUser(loginUser);
    }

    userAuth(user: User) {
        if (!user)
            return {
                isAuth: false,
                error: true,
            };

        const user_data = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile: user.profile,
            isAuth: true,
            royal: user.royal,
            following: user.following,
            follower: user.follower,
            status: user.status,
            isActive: user.isActive,
        };

        return user_data;
    }

    passwordUpdateUser(user: User, passwordUserDto: PasswordUserDto) {
        return this.authRepository.passwordUpdateUser(user, passwordUserDto);
    }

    getUserList(user: User) {
        return this.authRepository.getUserList(user);
    }

    async googleLogin(req, res) {
        return this.authRepository.googleLogin(req, res);
    }

    async kakaoLogin(req, res: Response) {
        return this.authRepository.kakaoLogin(req, res);
    }

    followUser(user: User, othersId: string) {
        return this.authRepository.followUser(user, othersId);
    }

    unfollowUser(user: User, othersId: string): Promise<{ message: string }> {
        return this.authRepository.unfollowUser(user, othersId);
    }
}
