import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { stream } from './configs/winston';

config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 5000;

    const config_swagger = new DocumentBuilder()
        .setTitle('RoYal API')
        .setDescription('RoYal 개발을 위한 API 문서')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config_swagger);
    SwaggerModule.setup('api', app, document);

    const morganFormat =
        'HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms';
    app.use(
        morgan(morganFormat, {
            skip: function (req, res) {
                return res.statusCode < 400;
            },
            stream,
        }),
    );
    await app.listen(port, () => console.log(`server runing on ${port}`));
    console.log('mongoDB runnig');
}
bootstrap();
