import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/schemas/User';

import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
    imports: [
        // (해당 모듈 스코프 제한)을 이용하여 데이터베이스 커넥션을 맺으며 사용할 엔티티를 리스트로 받도록 되어 있습니다.
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
})
export class AuthModule {}
