/* eslint-disable @typescript-eslint/no-empty-function */
import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { errStatus, Success } from 'src/commonDto/resStatus.dto';
import { ReqUser } from 'src/utils/auth.decorater';
import { AuthGuard_renewal } from 'src/utils/auth.guard';

import { AuthService } from './auth.service';
import {
    AuthUserDto,
    CreateUserDto,
    LoginUser,
    otherIdDto,
    PasswordUserDto,
    tokenSuccess,
    UnAuthUserDto,
} from './dto/user.dto';

@ApiTags('user')
@Controller('api/auth')
export class AuthController {
    constructor(private userService: AuthService) {}

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '회원가입' })
    @Post('/register')
    @UsePipes(ValidationPipe)
    registerUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<{ success: true } | errStatus> {
        return this.userService.registerUser(createUserDto);
    }

    @ApiOkResponse({ description: 'success', type: tokenSuccess })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '로그인' })
    @Post('/login')
    @UsePipes(ValidationPipe)
    loginUser(@Body() loginUser: LoginUser): Promise<{ token } | errStatus> {
        return this.userService.loginUser(loginUser);
    }

    @Get('/')
    userAuth(@ReqUser() userId: string): Promise<AuthUserDto | UnAuthUserDto> {
        return this.userService.userAuth(userId);
    }

    @Post('/logout') //로그아웃
    @UseGuards(AuthGuard_renewal)
    logoutUSer(@ReqUser() userId: string): { success: true } {
        return { success: true };
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '비밀번호 변경하기' })
    @ApiBearerAuth()
    @Put('/update_password')
    @UseGuards(AuthGuard_renewal)
    @UsePipes(ValidationPipe)
    passwordUpdateUser(
        @ReqUser() userId: string,
        @Body() passwordUserDto: PasswordUserDto,
    ): Promise<{ success: true } | errStatus> {
        return this.userService.passwordUpdateUser(userId, passwordUserDto);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 팔로우 하기' })
    @ApiBody({ type: otherIdDto })
    @ApiBearerAuth()
    @Post('/follow')
    @UseGuards(AuthGuard_renewal)
    followUser(
        @ReqUser() userId: string,
        @Body('othersId') othersId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.userService.followUser(userId, othersId);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 팔로우 비활성화' })
    @ApiBody({ type: otherIdDto })
    @ApiBearerAuth()
    @Delete('/unfollow')
    @UseGuards(AuthGuard_renewal)
    unfollowUser(
        @ReqUser() userId: string,
        @Body('othersId') othersId: string,
    ): Promise<{ success: true } | errStatus> {
        return this.userService.unfollowUser(userId, othersId);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 리스트 불러오기' })
    @ApiBearerAuth()
    @Get('/userList')
    @UseGuards(AuthGuard_renewal)
    getUserList(@ReqUser() userId: string) {
        return this.userService.getUserList(userId);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 프로필 사진 변경하기' })
    @ApiBearerAuth()
    @Put('/profile')
    @UseGuards(AuthGuard_renewal)
    updateProfile(
        @ReqUser() userId: string,
        @Body() profile: any,
    ): Promise<{ success: true } | errStatus> {
        return this.userService.updateProfile(userId, profile);
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        return res.redirect('http://localhost:8080');
    }

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoAuth(@Req() req) {
        console.log(req);
    }

    @Get('/kakao/redirect')
    @UseGuards(AuthGuard('kakao'))
    kakaoAuthRedirect(@Req() req, @Res() res: Response) {
        return this.userService.kakaoLogin(req, res);
    }
}
