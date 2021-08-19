import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT

  await app.listen(port);
}
bootstrap();

// DB_HOST=
// DB_USER=
// DB_PW=
// DB_NAME=

// PORT=

// JWT_SECRET=
// JWT_EXP=