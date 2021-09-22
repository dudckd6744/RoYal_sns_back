import {
    BadRequestException,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';

import { verifyToken } from './utils.jwt';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {} // eslint-disable-next-line @typescript-eslint/ban-types
    public async use(req: Request, res: Response, next: NextFunction) {
        const email = await this.parseUserId(req);

        const anyReq = req as any;

        const user = await this.userModel.findOne({ email });
        //인증부분 재검토

        anyReq.user = user;

        return next();
    }

    private async parseUserId(req: Request): Promise<string> {
        let email: string;
        try {
            const { authorization } = req.headers;

            const token = authorization
                .replace('Bearer ', '')
                .replace('bearer ', '');

            const decoded = await verifyToken(token);

            email = decoded.email;
        } catch (err) {} /* eslint no-empty: "off" */

        return email;
    }
}
