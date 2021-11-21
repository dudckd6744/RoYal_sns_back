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
import { User } from 'src/schemas/User';
import { AuthGuard_renewal } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';

import { AuthService } from './auth.service';
import {
    CreateUserDto,
    errStatus,
    LoginUser,
    otherIdDto,
    PasswordUserDto,
    Success,
    tokenSuccess,
} from './dto/user.create.dto';

@ApiTags('user')
@Controller('api/auth')
export class AuthController {
    constructor(private userService: AuthService) {}

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '회원가입' })
    @Post('/register')
    @UsePipes(ValidationPipe)
    registerUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.registerUser(createUserDto);
    }

    @ApiOkResponse({ description: 'success', type: tokenSuccess })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '로그인' })
    @Post('/login')
    @UsePipes(ValidationPipe)
    loginUser(@Body() loginUser: LoginUser) {
        return this.userService.loginUser(loginUser);
    }

    @Get('/')
    userAuth(@ReqUser() user: User) {
        return this.userService.userAuth(user);
    }

    @Post('/logout') //로그아웃
    @UseGuards(AuthGuard_renewal)
    logoutUSer(@ReqUser() user: User) {
        return { success: true };
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '비밀번호 변경하기' })
    @ApiBearerAuth()
    @Put('/update_password')
    @UseGuards(AuthGuard_renewal)
    passwordUpdateUser(
        @ReqUser() user: User,
        @Body() passwordUserDto: PasswordUserDto,
    ) {
        return this.userService.passwordUpdateUser(user, passwordUserDto);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 팔로우 하기' })
    @ApiBody({ type: otherIdDto })
    @ApiBearerAuth()
    @Post('/follow')
    @UseGuards(AuthGuard_renewal)
    followUser(@ReqUser() user: User, @Body('othersId') othersId: string) {
        return this.userService.followUser(user, othersId);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 팔로우 비활성화' })
    @ApiBody({ type: otherIdDto })
    @ApiBearerAuth()
    @Delete('/unfollow')
    @UseGuards(AuthGuard_renewal)
    unfollowUser(@ReqUser() user: User, @Body('othersId') othersId: string) {
        return this.userService.unfollowUser(user, othersId);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 리스트 불러오기' })
    @ApiBearerAuth()
    @Get('/userList')
    @UseGuards(AuthGuard_renewal)
    getUserList(@ReqUser() user: User) {
        return this.userService.getUserList(user);
    }

    @ApiOkResponse({ description: 'success', type: Success })
    @ApiBadRequestResponse({ description: 'false', type: errStatus })
    @ApiOperation({ summary: '유저 프로필 사진 변경하기' })
    @ApiBearerAuth()
    @Put('/profile')
    @UseGuards(AuthGuard_renewal)
    updateProfile(@ReqUser() user: User, @Body() profile: any) {
        return this.userService.updateProfile(user, profile);
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
