import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { errStatus } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';

import { CreateUserDto } from './dto/user.dto';

export class AuthRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findByNameUser(name: string): Promise<User> {
        return await this.userModel.findOne({ name: name });
    }

    async createUser(userInfo: CreateUserDto): Promise<User> {
        const { name, email, password, profile, phone } = userInfo;

        return await this.userModel.create({
            type: '',
            name,
            email,
            password,
            phone,
            profile,
        });
    }

    async findByIdUser(userId: string): Promise<User> {
        return await this.userModel.findOne({ _id: userId });
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

    async getUserList(userId: string): Promise<User[] | errStatus> {
        return await this.userModel
            .find({ _id: { $ne: userId } })
            .select(
                'name phone email profile following follower royal status isActive createdAt',
            );
    }

    async updateProfile(userId: string, profile: any): Promise<User> {
        return await this.userModel.findByIdAndUpdate(
            { _id: userId },
            { profile: profile.profile },
        );
    }
    /* ------------------------------------------------------------------------------------------------------ */
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
}
