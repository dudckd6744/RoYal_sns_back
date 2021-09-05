import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as morgan from "morgan"
import { stream_1, stream } from "./configs/winston";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000
  const morganFormat =
        "HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms";

  app.use(
      morgan(morganFormat, {
          skip: function (req, res) {
              return res.statusCode < 400;
          },
          stream_1,
      }),
  );
  app.use(
      morgan(morganFormat, {
          skip: function (req, res) {
              return res.statusCode >= 400;
          },
          stream,
      }),
  );

  await app.listen(port);
}
bootstrap();
