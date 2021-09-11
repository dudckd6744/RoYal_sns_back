import { Injectable } from '@nestjs/common';

import {
    CreateUserDto,
    LoginUser,
    PasswordUserDto,
} from './dto/user.create.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) {}

    registerUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
        return this.userRepository.registerUser(createUserDto);
    }

    async loginUser(loginUser: LoginUser): Promise<{ token: string }> {
        return this.userRepository.loginUser(loginUser);
    }

    passwordUpdateUser(
        email: string,
        passwordUserDto: PasswordUserDto,
    ): Promise<{ message: string }> {
        return this.userRepository.passwordUpdateUser(email, passwordUserDto);
    }

    async googleLogin(req) {
        return this.userRepository.googleLogin(req);
    }

    async kakaoLogin(req) {
        return this.userRepository.kakaoLogin(req);
    }
}
