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

    async registerUser(
        createUserDto: CreateUserDto,
    ): Promise<{ message: string }> {
        const { name, email, password, profile } = createUserDto;

        const image = profile ? profile : null;

        const user_data = await this.userModel.findOne({email})

        if(user_data) throw new BadRequestException("이미 해당 이메일이 존재합니다.")
        
        const salt = await bcrypt.genSalt();
        const hash_password = await bcrypt.hash(password, salt);

        const user = await this.userModel.create({
            type: '',
            name,
            email,
            password: hash_password,
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

    async loginUser(loginUser: LoginUser): Promise<{ token: string }> {
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

    async passwordUpdateUser(
        user: User,
        passwordUserDto: PasswordUserDto,
    ): Promise<{ message: string }> {
        const { password, new_password, confirm_new_password } =
            passwordUserDto;

        if (new_password != confirm_new_password)
            throw new BadRequestException('다시 한번 비밀번호를 확인해주세요!');

        const user_data = await this.userModel.findOne({ _id:user._id });

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
        return { message: 'suucess' };
    }

    async googleLogin(req,res) {
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
            user: user
      }
    }

    async kakaoLogin(req, res:Response) {
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

        return res.redirect("http://localhost:8080")
    }

    async followUser(
        user: User,
        othersId: string
    ): Promise<{message: string}> {
        const user_data = await this.userModel.findOne({_id:user._id})

        user_data.followTo.forEach((element, i)=>{
            if(element == othersId){
                throw new BadRequestException('이미 follw 한 상대입니다.')
            }
        })

        const otherUser = await this.userModel.findOne({_id:othersId})
        if(otherUser){

            if(otherUser.status == "1%" && user_data.royal > 10){user_data.royal = user_data.royal -10,user_data.save()}
            else if(otherUser.status == "3%" && user_data.royal > 0){user_data.royal = user_data.royal -8, user_data.save()}
            else if(otherUser.status == "5%" && user_data.royal > 5){user_data.royal = user_data.royal -5, user_data.save()}
            else if(otherUser.status == "10%" && user_data.royal > 1){user_data.royal = user_data.royal -1, user_data.save()}
            else{
                throw new BadRequestException(`유저의 로얄이 ${user_data.royal} royal 남아있습니다. 충전이 필요합니다.`)
            }

        }

        await this.userModel.findOneAndUpdate(
             {_id: user._id},
             { $push: { followTo: othersId  } }
        )
        return {message: 'success'}
    }

    async unfollowUser(
        user: User,
        othersId: string
    ): Promise<{message: string}> {
        const user_data = await this.userModel.findOne({_id:user._id})
        
        let others_data = ""

        user_data.followTo.forEach(element =>{
            if(element == othersId){
                others_data = element
            }
        })
        if(!others_data) throw new BadRequestException('이미 unfollow 한 상대입니다.')

        await this.userModel.findOneAndUpdate(
             {_id: user._id},
             { $pull: { followTo: others_data } }
        )

        return {message: 'success'}
    }
}
