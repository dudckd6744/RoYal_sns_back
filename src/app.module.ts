import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    //typeorm의 createConnection와 같은 파라미터를 제공받으며 App 전체에서 접근 가능한 Context의 connection을 주입받습니다. 
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule
  ],
})
export class AppModule {}
