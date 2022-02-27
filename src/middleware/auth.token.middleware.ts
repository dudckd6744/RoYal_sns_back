/* eslint-disable prefer-const */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User';

import { verifyToken } from '../utils/jwt';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
    public async use(req: Request, res: Response, next: NextFunction) {
        const userId = await this.parseUserId(req);

        const anyReq = req as any;
        //인증부분 재검토
        console.log(userId);
        anyReq.userId = userId;

        return next();
    }

    private async parseUserId(req: Request): Promise<string> {
        let userId: string;
        try {
            const { authorization } = req.headers;

            const token = authorization
                .replace('Bearer ', '')
                .replace('bearer ', '');

            const decoded = await verifyToken(token);

            userId = decoded.userId;
        } catch (e) {}
        return userId;
    }
}
