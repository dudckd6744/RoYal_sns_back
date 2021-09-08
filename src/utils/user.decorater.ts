import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/auth/user.entity';

export const ReqUser = createParamDecorator<unknown, ExecutionContext>(
  async (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      return user;
    }
    return req.user;
  },
);
