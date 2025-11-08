import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './gateway/usuarios/usuarios.module';
import { LabTestsModule } from './gateway/solicitudes/solicitudes.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GqlThrottlerGuard } from './common/guards/graphql-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // GraphQL Module
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
        sortSchema: true,
        playground: configService.get('GRAPHQL_PLAYGROUND') === 'true',
        introspection: configService.get('GRAPHQL_INTROSPECTION') === 'true',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        context: ({ req, res }) => {
          // Asegurar que req existe
          if (!req) {
            console.warn('⚠️ Request no disponible en contexto GraphQL');
            return { req: {}, res };
          }
          return { req, res };
        },
        formatError: error => {
          console.error('GraphQL Error:', {
            message: error.message,
            code: error.extensions?.code,
            path: error.path,
            originalError: error.extensions?.originalError,
          });
          return {
            message: error.message,
            code: error.extensions?.code,
            locations: error.locations,
            path: error.path,
          };
        },
      }),
    }),

    // Rate Limiting Module
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: parseInt(configService.get('THROTTLE_TTL', '60')),
          limit: parseInt(configService.get('THROTTLE_LIMIT', '100')),
        },
      ],
    }),

    // Feature Modules
    AuthModule,
    UsuariosModule,
    LabTestsModule,
  ],
  providers: [
    // 🔓 SEGURIDAD DESACTIVADA PARA DESARROLLO
    // Global JWT Guard (DESACTIVADO)
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // Global Rate Limiting (DESACTIVADO)
    // {
    //   provide: APP_GUARD,
    //   useClass: GqlThrottlerGuard,
    // },
  ],
})
export class AppModule {}
