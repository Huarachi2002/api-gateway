import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PatientsService } from './patients.service';
import { PatientsResolver } from './patients.resolver';
import { LabTestsModule } from '../solicitudes/solicitudes.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
    LabTestsModule, // Importar para poder usar LabTestsService en el resolver
  ],
  providers: [PatientsService, PatientsResolver],
  exports: [PatientsService],
})
export class PatientsModule {}
