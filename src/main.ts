import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS configuration (ANTES del global prefix)
  app.enableCors({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
  });

  // Global prefix (GraphQL no se verá afectado por esto)
  // app.setGlobalPrefix('api');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const port = configService.get('PORT') || 3000;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.listen(port);

  console.log(`
    API Gateway is running on: http://localhost:${port}
    GraphQL Playground: http://localhost:${port}/graphql
  `);
}

bootstrap();
