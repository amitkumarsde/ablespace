import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Get the logged-in user from the request.
export const CurrentUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});
