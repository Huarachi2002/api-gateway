import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    
    // Asegurar que req existe con propiedades básicas
    const req = ctx.req || {
      ip: '0.0.0.0',
      headers: {},
      method: 'POST',
      url: '/graphql',
    };
    
    const res = ctx.res || {};
    
    return { req, res };
  }
}
