import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express'; //Use this particular request in order to use createParamDecorator

export const ExtractKeyFromRequest = createParamDecorator(
  (data: keyof Request, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.[data];
  },
);
