import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const context = gqlHost.getContext();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();
            message =
                typeof response === 'string'
                    ? response
                    : (response as any).message || message;
        }

        console.error('Error capturado: ', {
            status,
            message,
            timestamp: new Date().toISOString(),
            path: context?.req?.url,
        });

        throw exception;
    }
}