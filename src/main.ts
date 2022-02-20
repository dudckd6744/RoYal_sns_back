import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { stream } from './configs/winston';
import { HttpExceptionFilter } from './middleware/exception';
import { SuccessInterceptor } from './utils/success.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const port = process.env.PORT || 5000;

    const config_swagger = new DocumentBuilder()
        .setTitle('RoYal API')
        .setDescription('RoYal 개발을 위한 API 문서')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config_swagger);
    SwaggerModule.setup('api', app, document);

    morgan.format('dev', (tokens, req, res) => {
        return [
            '\n HTTP_version :',
            tokens['http-version'](req, res),
            '\n IP :',
            tokens['remote-addr'](req, res),
            '\n Method :',
            tokens.method(req, res),
            '\n Body :',
            JSON.stringify(req.body),
            '\n URI :',
            decodeURI(tokens.url(req, res)), // I changed this from the doc example, which is the 'dev' config.
            '\n Remote_user :',
            tokens['remote-user'](req, res),
            '\n Res_status :',
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '\n User_Agemnt :',
            tokens['user-agent'](req, res),
            '-',
            tokens['response-time'](req, res),
            'ms',
        ].join(' ');
    });

    app.use(
        morgan('dev', {
            skip: function (req, res) {
                return res.statusCode < 400;
            },
            stream,
        }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new SuccessInterceptor());

    await app.listen(port, () => console.log(`server runing on ${port}`));
    console.log('mongoDB runnig');
}
bootstrap();
