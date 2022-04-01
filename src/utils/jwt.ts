/* eslint-disable @typescript-eslint/ban-types */
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

const configService = new ConfigService();

export async function signToken(
    payload: Object,
    options: jwt.SignOptions = {},
): Promise<string> {
    const jwtSecret = configService.get('JWT_SECRET') || 'secret';

    const { expiresIn } = options;
    return new Promise((res, rej) =>
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: expiresIn ?? '7d' },
            (err, token) => {
                if (err) rej(err);
                res(token);
            },
        ),
    );
}

export async function verifyToken(token: string): Promise<any> {
    const jwtSecret = configService.get('JWT_SECRET');

    return new Promise((res, rej) =>
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) rej(err);
            res(decoded);
        }),
    );
}
