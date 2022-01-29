import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL:
                'http://ec2-3-36-94-177.ap-northeast-2.compute.amazonaws.com:5000/api/auth/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { displayName, emails, photos } = profile;

        const user = {
            email: emails[0].value,
            name: displayName,
            picture: photos[0].value,
            accessToken,
            refreshToken,
        };

        done(null, user);
    }
}
