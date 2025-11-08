import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    // Asegurar que el request existe y tiene las propiedades necesarias
    if (!request) {
      console.warn('⚠️ Request no disponible en JwtAuthGuard');
      return {
        headers: {},
        ip: '0.0.0.0',
        method: 'POST',
        url: '/graphql',
      };
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      console.log('🔓 Ruta pública, omitiendo autenticación');
      return true;
    }

    return super.canActivate(context);
  }
}
