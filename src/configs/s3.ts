import { ConfigService } from '@nestjs/config';
import * as aws from 'aws-sdk';

const configService = new ConfigService();

export const s3 = new aws.S3({
    accessKeyId: configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: 'ap-northeast-2',
});
