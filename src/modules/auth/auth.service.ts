/* eslint-disable prefer-const */
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as mongoose from 'mongoose';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';
import { signToken } from 'src/utils/jwt';

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

    async registerUser(
        createUserDto: CreateUserDto,
    ): Promise<{ success: true } | errStatus> {
        let { email, name, password, profile, phone } = createUserDto;

        profile = profile ?? null;

        const userEmail = await this.authRepository.findByEmailUser(email);
        const userName = await this.authRepository.findByNameUser(name);
        if (userEmail)
            throw new BadRequestException('이미 해당 이메일이 존재합니다.');
        if (userName)
            throw new BadRequestException('이미 해당 이름이 존재합니다.');

        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        let userInfo = { email, name, password, profile, phone };

        this.authRepository.createUser(userInfo);

        return { success: true };
    }

    async loginUser(loginUser: LoginUser): Promise<{ token } | errStatus> {
        const { email, password } = loginUser;

        const user = await this.authRepository.findByEmailUser(email);

        if (!user)
            throw new UnauthorizedException('해당 유저가 존재하지않습니다.');

        if (await bcrypt.compare(password, user.password)) {
            const userId = user._id;
            const token = await signToken({ userId });
            return { token };
        } else {
            throw new UnauthorizedException('비밀번호를 다시 확인해주세요.');
        }
    }

    async userAuth(userId: string): Promise<AuthUserDto | UnAuthUserDto> {
        const user = await this.authRepository.findByIdUser(userId);

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
        userId: string,
        passwordUserDto: PasswordUserDto,
    ): Promise<{ success: true } | errStatus> {
        const { password, new_password, confirm_new_password } =
            passwordUserDto;

        const user_data = await this.authRepository.findByIdUser(userId);

        if (new_password != confirm_new_password)
            throw new BadRequestException('다시 한번 비밀번호를 확인해주세요!');
        console.log(user_data);

        if (await bcrypt.compare(password, user_data.password)) {
            const salt = await bcrypt.genSalt();
            const hash_password = await bcrypt.hash(new_password, salt);
            user_data.password = hash_password;
            user_data.save();
        } else {
            throw new BadRequestException(
                '기존에 있던 비밀번호를 다시 입력해주세요',
            );
        }
        return { success: true };
    }

    async getUserList(userId: string): Promise<User[] | errStatus> {
        return await this.authRepository.getUserList(userId);
    }

    async googleLogin(req, res) {
        return this.authRepository.googleLogin(req, res);
    }

    async kakaoLogin(req, res: Response) {
        return this.authRepository.kakaoLogin(req, res);
    }

    async followUser(
        userId: string,
        othersId: string,
    ): Promise<{ success: true } | errStatus> {
        const user_data = await this.authRepository.findByIdUser(userId);
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
        userId: string,
        othersId: string,
    ): Promise<{ success: true } | errStatus> {
        const user_data = await this.authRepository.findByIdUser(userId);

        let others_data = '';

        user_data.following.forEach((element) => {
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

    async updateProfile(
        userId: string,
        profile: any,
    ): Promise<{ success: true } | errStatus> {
        await this.authRepository.updateProfile(userId, profile);

        return { success: true };
    }
}
