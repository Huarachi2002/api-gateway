import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LabTestsService } from './solicitudes.service';
// import { LabTest } from './dto/resultado.type';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { Resultado } from './dto/resultado.type';

@Resolver(() => Resultado)
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabTestsResolver {
  constructor(private labTestsService: LabTestsService) {}

  @Query(() => Resultado, {
    name: 'labTest',
    description: 'Obtener un análisis de laboratorio por ID',
  })
  @Roles(Role.ADMIN, Role.DOCTOR, Role.LABORATORY_TECH, Role.RECEPTIONIST)
  async getLabTest(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Resultado> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.labTestsService.findById(id);
  }

  @Query(() => [Resultado], {
    name: 'labTestsByPatient',
    description: 'Obtener análisis de laboratorio de un paciente',
  })
  @Roles(Role.ADMIN, Role.DOCTOR, Role.LABORATORY_TECH, Role.RECEPTIONIST)
  async getLabTestsByPatient(
    @Args('patientId', { type: () => ID }) patientId: string,
  ): Promise<Resultado[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.labTestsService.findByPatientId(patientId);
  }
}
