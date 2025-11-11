import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NotificacionService } from './notifications.service';
import { NotificacionResolver } from './notifications.resolver';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true, // Aceptar todas las respuestas HTTP
    }),
    ConfigModule,
  ],
  providers: [NotificacionService, NotificacionResolver],
  exports: [NotificacionService], // Exportar para usar en PatientsModule
})
export class NotificacionModule {}
