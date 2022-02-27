/* eslint-disable prefer-const */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';

import { verifyToken } from '../utils/jwt';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {} // eslint-disable-next-line @typescript-eslint/ban-types
    public async use(req: Request, res: Response, next: NextFunction) {
        const userId = await this.parseUserId(req);

        const anyReq = req as any;
        //인증부분 재검토

        anyReq.userId = userId;

        return next();
    }

    private async parseUserId(req: Request): Promise<string> {
        let userId: string;
        const { authorization } = req.headers;

        const token = authorization?.replace('Bearer ', '');

        const decoded = await verifyToken(token);

        userId = decoded.userId;

        return userId;
    }
}
