import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator<unknown, ExecutionContext>(
    async (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        if (req.body.email) {
            return req.body.email;
        }
        return req.user?.req.user.email;
    },
);
