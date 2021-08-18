import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "src/modules/auth/user.repository";
import { config } from "dotenv";
import { UnauthorizedException } from "@nestjs/common";

config();

export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepostory: UserRepository
    ){
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload){
        const { email } = payload;
        const user = await this.userRepostory.findOne({email})

        if(!user) throw new UnauthorizedException()
    
        return user;
    }
}