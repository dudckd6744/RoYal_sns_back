import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';

import { AuthRepository } from './auth.repository';
import {
    AuthUserDto,
    CreateUserDto,
    LoginUser,
    PasswordUserDto,
    UnAuthUserDto,
} from './dto/user.dto';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    registerUser(
        createUserDto: CreateUserDto,
    ): Promise<{ message: string } | errStatus> {
        return this.authRepository.registerUser(createUserDto);
    }

    async loginUser(loginUser: LoginUser): Promise<{ token } | errStatus> {
        return this.authRepository.loginUser(loginUser);
    }

    userAuth(user: User): AuthUserDto | UnAuthUserDto {
        if (!user) {
            const data: UnAuthUserDto = { isAuth: false, error: true };
            return data;
        }

        const user_data: AuthUserDto = {
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

    passwordUpdateUser(
        user: User,
        passwordUserDto: PasswordUserDto,
    ): Promise<{ success: true } | errStatus> {
        return this.authRepository.passwordUpdateUser(user, passwordUserDto);
    }

    getUserList(user: User): Promise<User[] | errStatus> {
        return this.authRepository.getUserList(user);
    }

    async googleLogin(req, res) {
        return this.authRepository.googleLogin(req, res);
    }

    async kakaoLogin(req, res: Response) {
        return this.authRepository.kakaoLogin(req, res);
    }

    followUser(
        user: User,
        othersId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.authRepository.followUser(user, othersId);
    }

    unfollowUser(
        user: User,
        othersId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.authRepository.unfollowUser(user, othersId);
    }

    updateProfile(
        user: User,
        profile: any,
    ): Promise<{ success: true } | errStatus> {
        return this.authRepository.updateProfile(user, profile);
    }
}
