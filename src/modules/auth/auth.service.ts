import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as mongoose from 'mongoose';
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

    async passwordUpdateUser(
        user: User,
        passwordUserDto: PasswordUserDto,
    ): Promise<{ success: true } | errStatus> {
        const { password, new_password, confirm_new_password } =
            passwordUserDto;

        const user_data = await this.authRepository.passwordUpdateUser(user);

        if (new_password != confirm_new_password)
            throw new BadRequestException('다시 한번 비밀번호를 확인해주세요!');

        if (await bcrypt.compare(password, user_data.password)) {
            const salt = await bcrypt.genSalt();
            const hash_password = await bcrypt.hash(new_password, salt);
            user_data.password = hash_password;
            await user_data.save();
        } else {
            throw new BadRequestException(
                '기존에 있던 비밀번호를 다시 입력해주세요',
            );
        }
        return { success: true };
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

    async followUser(
        email: string,
        othersId: string,
    ): Promise<{ success: true } | errStatus> {
        const user_data = await this.authRepository.findByEmailUser(email);
        const otherUser = await this.authRepository.findByIdUser(othersId);

        user_data.following.forEach((element) => {
            if (element == othersId) {
                throw new BadRequestException('이미 follw 한 상대입니다.');
            }
        });

        if (otherUser) {
            if (otherUser.status == '1%' && user_data.royal >= 10) {
                (user_data.royal = user_data.royal - 10), user_data.save();
            } else if (otherUser.status == '3%' && user_data.royal >= 8) {
                (user_data.royal = user_data.royal - 8), user_data.save();
            } else if (otherUser.status == '5%' && user_data.royal >= 5) {
                (user_data.royal = user_data.royal - 5), user_data.save();
            } else if (otherUser.status == '10%' && user_data.royal >= 1) {
                (user_data.royal = user_data.royal - 1), user_data.save();
            } else {
                throw new BadRequestException(
                    `유저의 로얄이 ${user_data.royal} royal 남아있습니다. 충전이 필요합니다.`,
                );
            }
        }
        await this.authRepository.followUser(user_data._id, otherUser._id);
        await this.authRepository.followingUser(otherUser._id, user_data._id);
        return { success: true };
    }

    async unfollowUser(
        email: string,
        othersId: string,
    ): Promise<{ success: true } | errStatus> {
        const user_data = await this.authRepository.findByEmailUser(email);

        let others_data = '';

        user_data.following.forEach((element) => {
            console.log(element, othersId);

            if (element == othersId) {
                others_data = element;
            }
        });
        if (!others_data)
            throw new BadRequestException('이미 unfollow 한 상대입니다.');

        const objectOthersId = mongoose.Types.ObjectId(othersId);

        await this.authRepository.unFollowUser(user_data._id, objectOthersId);
        await this.authRepository.unFollowingUser(
            objectOthersId,
            user_data._id,
        );

        return { success: true };
    }

    updateProfile(
        user: User,
        profile: any,
    ): Promise<{ success: true } | errStatus> {
        return this.authRepository.updateProfile(user, profile);
    }
}
