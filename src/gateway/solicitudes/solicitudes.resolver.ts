import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LabTestsService } from './solicitudes.service';
import { Resultado } from './dto/resultado.type';
import { Paciente } from './dto/paciente.type';
import { CreatePacienteInput } from './dto/create-paciente.input';
import { UpdatePacienteInput } from './dto/update-paciente.input';

@Resolver(() => Resultado)
export class LabTestsResolver {
  constructor(private labTestsService: LabTestsService) {}

  @Query(() => Paciente, {
    name: 'paciente',
    description: 'Obtener un paciente por ID',
  })
  async getPaciente(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Paciente> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.labTestsService.findPatientById(id);
  }

  @Query(() => Resultado, {
    name: 'labTest',
    description: 'Obtener un análisis de laboratorio por ID',
  })
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
  async getLabTestsByPatient(
    @Args('patientId', { type: () => ID }) patientId: string,
  ): Promise<Resultado[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.labTestsService.findByPatientId(patientId);
  }

  @Mutation(() => Paciente, {
    name: 'createPaciente',
    description: 'Crear un nuevo paciente',
  })
  async createPaciente(
    @Args('input') input: CreatePacienteInput,
  ): Promise<Paciente> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    console.log('Resolver - createPaciente llamado con input:', input);
    return this.labTestsService.createPaciente(input);
  }

  @Mutation(() => Paciente, {
    name: 'updatePaciente',
    description: 'Actualizar un paciente existente',
  })
  async updatePaciente(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePacienteInput,
  ): Promise<Paciente> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    console.log('Resolver - updatePaciente llamado con id e input:', id, input);
    return this.labTestsService.updatePaciente(id, input);
  }
}
