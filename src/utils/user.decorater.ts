import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const ReqUser = createParamDecorator<
  unknown,
  ExecutionContext
>((data: unknown, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest()
  console.log(req)
    return req.user;
})
