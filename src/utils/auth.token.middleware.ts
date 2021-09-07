import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UserRepository } from 'src/modules/auth/user.repository'
import { verifyToken } from './utils.jwt'



@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(private userService: UserRepository) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async use(req: Request, res: Response, next: NextFunction) {

    const email = await this.parseUserId(req)

    const anyReq = req as any

    const user = await this.userService.findOne({ email: email })

    anyReq.user = user
    return next()
  }

  private async parseUserId(req: Request): Promise<string> {
    let email: string 
    try {
      const { authorization } = req.headers

      const token = authorization.replace('Bearer ', '').replace('bearer ', '')
      const decoded = await verifyToken(token)

      email = decoded.email
    } catch (err) {} /* eslint no-empty: "off" */

    return email
  }
}
