import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { config } from 'dotenv';
import { jwtStrategy } from 'src/utils/jwt.strategy';

config();

@Module({
  imports: [
    // (해당 모듈 스코프 제한)을 이용하여 데이터베이스 커넥션을 맺으며 사용할 엔티티를 리스트로 받도록 되어 있습니다.
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXP),
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy],
  // exports:[jwtStrategy,PassportModule]
})
export class AuthModule {}
