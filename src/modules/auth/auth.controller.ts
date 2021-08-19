import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
import { ReqUser } from 'src/utils/user.decorater';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUser } from './dto/user.create.dto';
import { User } from './user.entity';

@Controller('auth')
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

    @Post('/test')
    @UseGuards(AuthGuard)
    test(@ReqUser() user:User){
        return user;
    }
}
