import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { User } from 'src/modules/auth/user.entity'

@Injectable()
export class AuthGuard_renewal implements CanActivate {

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    if (!req.user && !req.body.email) throw new UnauthorizedException('권한이 없습니다')
    return true
  }
}
