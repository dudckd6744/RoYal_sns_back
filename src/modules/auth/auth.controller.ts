/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuard_renewal } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUser, PasswordUserDto } from './dto/user.create.dto';
import { User } from './user.entity';

@Controller('api/auth')
export class AuthController {
    constructor(private userService: AuthService) {}

    @Post('/register')
    @UsePipes(ValidationPipe)
    registerUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<{message: string}>{
        return this.userService.registerUser(createUserDto);
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    loginUser(
        @Body() loginUser:LoginUser
    ): Promise<{token : string}> {
        return this.userService.loginUser(loginUser);
    }

    @Put('/update_password')
    @UseGuards(AuthGuard_renewal)
    passwordUpdateUser(
        @ReqUser() user:User,
        @Body() passwordUserDto: PasswordUserDto
    ): Promise<{message: string}> {
        return this.userService.passwordUpdateUser(user,passwordUserDto);
    }


    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req){
        return this.userService.googleLogin(req)
    }

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoAuth(@Req() req) {}

    @Get('/kakao/redirect')
    @UseGuards(AuthGuard('kakao'))
    kakaoAuthRedirect(@Req() req){
        return this.userService.kakaoLogin(req)
    }

    @Post("/test")
    test(@ReqUser() user: User) {
        return user;
    }

}

