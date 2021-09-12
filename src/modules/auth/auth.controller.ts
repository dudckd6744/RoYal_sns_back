/* eslint-disable @typescript-eslint/no-empty-function */
import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schemas/User';
import { AuthGuard_renewal } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';

import { AuthService } from './auth.service';
import {
    CreateUserDto,
    LoginUser,
    PasswordUserDto,
} from './dto/user.create.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private userService: AuthService) {}

    @Post('/register')
    @UsePipes(ValidationPipe)
    registerUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<{ message: string }> {
        return this.userService.registerUser(createUserDto);
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    loginUser(@Body() loginUser: LoginUser): Promise<{ token: string }> {
        return this.userService.loginUser(loginUser);
    }

    @Put('/update_password')
    @UseGuards(AuthGuard_renewal)
    passwordUpdateUser(
        @ReqUser() email: string,
        @Body() passwordUserDto: PasswordUserDto,
    ): Promise<{ message: string }> {
        return this.userService.passwordUpdateUser(email, passwordUserDto);
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.userService.googleLogin(req);
    }

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoAuth(@Req() req) {}

    @Get('/kakao/redirect')
    @UseGuards(AuthGuard('kakao'))
    kakaoAuthRedirect(@Req() req) {
        return this.userService.kakaoLogin(req);
    }
    
    @Post("/follow")
    @UseGuards(AuthGuard_renewal)
    followUser(
        @ReqUser() user:User,
        @Body('othersId') othersId: string
    ): Promise<{message: string}> {
        return this.userService.followUser(user, othersId)
    }

    @Delete("/unfollow")
    @UseGuards(AuthGuard_renewal)
    unfollowUser(
        @ReqUser() user:User,
        @Body('othersId') othersId: string
    ): Promise<{message: string}> {
        return this.userService.unfollowUser(user, othersId)
    }
    
    @Post('/test')
    test(@ReqUser() email: string) {
        return email;
    }

}
