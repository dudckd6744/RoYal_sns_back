import {
    BadRequestException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';
import { signToken } from 'src/utils/utils.jwt';

import {
    CreateUserDto,
    LoginUser,
    PasswordUserDto,
} from './dto/user.create.dto';

export class AuthRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async registerUser(createUserDto: CreateUserDto) {
        const { name, email, password, profile, phone } = createUserDto;

        const image = profile ? profile : null;

        const user_data = await this.userModel.findOne({ email });
        const user_data_name = await this.userModel.findOne({ name });

        if (user_data)
            return new BadRequestException('이미 해당 이메일이 존재합니다.');
        if (user_data_name)
            return new BadRequestException('이미 해당 이름이 존재합니다.');
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
                return new ConflictException('이미 해당 유저가 존재합니다.');
        }

        return { message: 'Success' };
    }

    async loginUser(loginUser: LoginUser) {
        const { email, password } = loginUser;
        const user = await this.userModel.findOne({ email });

        if (!user)
            return new UnauthorizedException('해당 유저가 존재하지않습니다.');
        else if (await bcrypt.compare(password, user.password)) {
            const email = user.email;
            const token = await signToken({ email });
            return { token };
        } else {
            return new UnauthorizedException('비밀번호를 다시 확인해주세요.');
        }
    }

    async passwordUpdateUser(user: User, passwordUserDto: PasswordUserDto) {
        const { password, new_password, confirm_new_password } =
            passwordUserDto;

        if (new_password != confirm_new_password)
            return new BadRequestException(
                '다시 한번 비밀번호를 확인해주세요!',
            );

        const user_data = await this.userModel.findOne({ _id: user._id });

        if (await bcrypt.compare(password, user_data.password)) {
            const salt = await bcrypt.genSalt();
            const hash_password = await bcrypt.hash(new_password, salt);
            user_data.password = hash_password;
            await user_data.save();
        } else {
            return new BadRequestException(
                '기존에 있던 비밀번호를 다시 입력해주세요',
            );
        }
        return { success: true };
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

    async followUser(user: User, othersId: string) {
        const user_data = await this.userModel.findOne({ _id: user._id });

        user_data.following.forEach((element) => {
            if (element == othersId) {
                return new BadRequestException('이미 follw 한 상대입니다.');
            }
            return true;
        });

        const otherUser = await this.userModel.findOne({ _id: othersId });
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
                return new BadRequestException(
                    `유저의 로얄이 ${user_data.royal} royal 남아있습니다. 충전이 필요합니다.`,
                );
            }
        }

        await this.userModel.findOneAndUpdate(
            { _id: user._id },
            { $push: { following: othersId } },
        );
        await this.userModel.findOneAndUpdate(
            { _id: othersId },
            { $push: { follower: user._id } },
        );
        return { success: true };
    }

    async unfollowUser(user: User, othersId: string) {
        const user_data = await this.userModel.findOne({ _id: user._id });

        let others_data = '';

        user_data.following.forEach((element) => {
            if (element == othersId) {
                others_data = element;
            }
        });
        if (!others_data)
            return new BadRequestException('이미 unfollow 한 상대입니다.');

        await this.userModel.findOneAndUpdate(
            { _id: user._id },
            { $pull: { following: others_data } },
        );

        await this.userModel.findOneAndUpdate(
            { _id: othersId },
            { $pull: { follower: user._id } },
        );
        return { success: true };
    }

    async getUserList(user: User) {
        const userList = await this.userModel
            .find({ _id: { $ne: user._id } })
            .select(
                'name phone email profile following follower royal status isActive createdAt',
            );
        return userList;
    }

    async updateProfile(user: User, profile: any) {
        await this.userModel.findByIdAndUpdate(
            { _id: user._id },
            { profile: profile.profile },
        );
        return { success: true };
    }
}
