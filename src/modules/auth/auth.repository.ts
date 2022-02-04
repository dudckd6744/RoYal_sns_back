import {
    BadRequestException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';
import { signToken } from 'src/utils/jwt';

import { CreateUserDto, LoginUser, PasswordUserDto } from './dto/user.dto';

export class AuthRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async registerUser(
        createUserDto: CreateUserDto,
    ): Promise<{ message: string } | errStatus> {
        const { name, email, password, profile, phone } = createUserDto;

        const image = profile ? profile : null;

        const user_data = await this.userModel.findOne({ email });
        const user_data_name = await this.userModel.findOne({ name });

        if (user_data)
            throw new BadRequestException('이미 해당 이메일이 존재합니다.');
        if (user_data_name)
            throw new BadRequestException('이미 해당 이름이 존재합니다.');
        const salt = await bcrypt.genSalt();
        const hash_password = await bcrypt.hash(password, salt);

        const user = await this.userModel.create({
            type: '',
            name,
            email,
            password: hash_password,
            phone,
            profile: image,
        });

        try {
            await user.save();
        } catch (err) {
            if (err.code == 'ER_DUP_ENTRY')
                throw new ConflictException('이미 해당 유저가 존재합니다.');
        }

        return { message: 'Success' };
    }

    async loginUser(loginUser: LoginUser): Promise<{ token } | errStatus> {
        const { email, password } = loginUser;
        const user = await this.userModel.findOne({ email });

        if (!user)
            throw new UnauthorizedException('해당 유저가 존재하지않습니다.');
        else if (await bcrypt.compare(password, user.password)) {
            const email = user.email;
            const token = await signToken({ email });
            return { token };
        } else {
            throw new UnauthorizedException('비밀번호를 다시 확인해주세요.');
        }
    }

    async passwordUpdateUser(user: User): Promise<User> {
        const user_data = await this.userModel.findOne({ _id: user._id });
        return user_data;
    }

    async googleLogin(req, res) {
        if (!req.user) {
            throw new BadRequestException('잘못된 계정입니다.');
        }

        const user = req.user;

        await this.userModel.findOneAndUpdate(
            {
                email: user.email,
            },
            {
                email: user.email,
                type: 'goole',
                name: user.name,
                profile: user.picture,
            },
            { upsert: true },
        );

        return {
            user: user,
        };
    }

    async kakaoLogin(req, res: Response) {
        if (!req.user) {
            throw new BadRequestException('잘못된 계정입니다.');
        }

        const user = req.user;

        await this.userModel.findOneAndUpdate(
            {
                email: user.email,
            },
            {
                email: user.email,
                type: 'kakao',
                name: user.name,
                profile: user.picture,
            },
            { upsert: true },
        );

        return res.redirect('http://localhost:8080');
    }

    async findByIdUser(othersId: string): Promise<User> {
        return await this.userModel.findOne({ _id: othersId });
    }

    async findByEmailUser(email: string): Promise<User> {
        return await this.userModel.findOne({ email });
    }

    async followUser(userId: string, othersId: string): Promise<User> {
        return await this.userModel.findOneAndUpdate(
            { _id: userId },
            { $push: { following: othersId } },
        );
    }

    async followingUser(othersId: string, userId: string): Promise<User> {
        return await this.userModel.findOneAndUpdate(
            { _id: othersId },
            { $push: { follower: userId } },
        );
    }

    async unFollowUser(
        userId: string,
        othersId: mongoose.Types.ObjectId,
    ): Promise<User> {
        return await this.userModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { following: othersId } },
        );
    }

    async unFollowingUser(
        othersId: mongoose.Types.ObjectId,
        userId: string,
    ): Promise<User> {
        return await this.userModel.findOneAndUpdate(
            { _id: othersId },
            { $pull: { follower: userId } },
        );
    }

    async getUserList(user: User): Promise<User[] | errStatus> {
        const userList = await this.userModel
            .find({ _id: { $ne: user._id } })
            .select(
                'name phone email profile following follower royal status isActive createdAt',
            );
        return userList;
    }

    async updateProfile(
        user: User,
        profile: any,
    ): Promise<{ success: true } | errStatus> {
        await this.userModel.findByIdAndUpdate(
            { _id: user._id },
            { profile: profile.profile },
        );
        return { success: true };
    }
}
