import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LabTestsService } from './solicitudes.service';
import { LabTestsResolver } from './solicitudes.resolver';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true, // Aceptar todas las respuestas HTTP
    }),
    ConfigModule,
  ],
  providers: [LabTestsService, LabTestsResolver],
  exports: [LabTestsService], // Exportar para usar en PatientsModule
})
export class LabTestsModule {}
