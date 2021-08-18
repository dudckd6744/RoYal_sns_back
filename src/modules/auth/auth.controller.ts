import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/utils/user.decorater';
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
    ): Promise<User>{
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
    @UseGuards(AuthGuard())
    test(@GetUser() user:User){
        return user;
    }
}
