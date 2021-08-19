import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { config } from 'dotenv';


config();

@Module({
  imports: [
    // (해당 모듈 스코프 제한)을 이용하여 데이터베이스 커넥션을 맺으며 사용할 엔티티를 리스트로 받도록 되어 있습니다.
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
