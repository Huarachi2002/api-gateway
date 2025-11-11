import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LabTestsService } from './solicitudes.service';
import { Resultado } from './dto/resultado.type';
import { Paciente } from './dto/paciente.type';
import { CreatePacienteInput } from './dto/create-paciente.input';
import { UpdatePacienteInput } from './dto/update-paciente.input';
import { Solicitud } from './dto/solicitud.type';
import { CreateSolicitudInput } from './dto/create-solicitud.input';
import { UpdateSolicitudInput } from './dto/update-solicitud.input';
import { EstadoSolicitud } from './dto/esado-solicitud.type';
import { UpdateEstadoSolicitudInput } from './dto/update-estado-solicitud.input';
import { CreateEstadoSolicitudInput } from './dto/create-estado-solicitud.input';
import { TipoLaboratorio } from './dto/tipo-laboratorio.type';
import { UpdateTipoLaboratorioInput } from './dto/update-tipo-laboratorio.input';
import { CreateTipoLaboratorioInput } from './dto/create-tipo-laboratorio.input';
import { CreateResultadoInput } from './dto/create-resultado.input';
import { UpdateResultadoInput } from './dto/update-resultado.input';
import { TipoExamen } from './dto/tipo-examen.type';
import { CreateTipoExamenInput } from './dto/create-tipo-examen.input';
import { UpdateTipoExamenInput } from './dto/update-tipo-examen.input';
import { ExamenSolicitud } from './dto/examen-solicitud.type';
import { CreateExamenSolicitudInput } from './dto/create-examen-solicitud.input';
import { UpdateExamenSolicitudInput } from './dto/update-examen-solicitud.input';

@Resolver(() => Resultado)
export class LabTestsResolver {
  constructor(private labTestsService: LabTestsService) {}

  @Query(() => [Paciente], {
    name: 'pacientes',
    description: 'Obtener todos los pacientes',
  })
  async getAllPacientes(): Promise<Paciente[]> {
    return this.labTestsService.getAllPacientes();
  }

  @Query(() => Paciente, {
    name: 'paciente',
    description: 'Obtener un paciente por ID',
  })
  async getPaciente(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Paciente> {
    return this.labTestsService.findPatientById(id);
  }

  @Mutation(() => Paciente, {
    name: 'createPaciente',
    description: 'Crear un nuevo paciente',
  })
  async createPaciente(
    @Args('input') input: CreatePacienteInput,
  ): Promise<Paciente> {
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
    console.log('Resolver - updatePaciente llamado con id e input:', id, input);
    return this.labTestsService.updatePaciente(id, input);
  }

  @Query(() => Solicitud, {
    name: 'solicitud',
    description: 'Obtener una solicitud por ID',
  })
  async getSolicitud(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Solicitud> {
    return this.labTestsService.findSolicitudById(id);
  }

  @Query(() => [Solicitud], {
    name: 'solicitudes',
    description: 'Obtener todas las solicitudes',
  })
  async getAllSolicitudes(): Promise<Solicitud[]> {
    return this.labTestsService.getAllSolicitudes();
  }

  @Query(() => Resultado, {
    name: 'resultadoPorSolicitud',
    description: 'Obtener un resultado por su solicitud',
  })
  async getResultadoPorSolicitud(
    @Args('solicitudId', { type: () => ID }) solicitudId: string,
  ): Promise<Resultado> {
    return this.labTestsService.findResultadoBySolicitudId(solicitudId);
  }

  @Mutation(() => Solicitud, {
    name: 'createSolicitud',
    description: 'Crear una nueva solicitud',
  })
  async createSolicitud(
    @Args('input') input: CreateSolicitudInput,
  ): Promise<Solicitud> {
    console.log('Resolver - createSolicitud llamado con input:', input);
    return this.labTestsService.createSolicitud(input);
  }

  @Mutation(() => Solicitud, {
    name: 'updateSolicitud',
    description: 'Actualizar una solicitud existente',
  })
  async updateSolicitud(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateSolicitudInput,
  ): Promise<Solicitud> {
    console.log(
      'Resolver - updateSolicitud llamado con id e input:',
      id,
      input,
    );
    return this.labTestsService.updateSolicitud(id, input);
  }

  @Query(() => EstadoSolicitud, {
    name: 'estadoSolicitud',
    description: 'Obtener un estado de solicitud por ID',
  })
  async getEstadoSolicitud(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<EstadoSolicitud> {
    return this.labTestsService.findEstadoSolicitudById(id);
  }

  @Query(() => [EstadoSolicitud], {
    name: 'estadosSolicitud',
    description: 'Obtener todos los estados de solicitud',
  })
  async getAllEstadosSolicitud(): Promise<EstadoSolicitud[]> {
    return this.labTestsService.getAllEstadosSolicitud();
  }

  @Query(() => [Solicitud], {
    name: 'solicitudesPorEstado',
    description: 'Obtener todas las solicitudes por estado_id',
  })
  async getSolicitudesPorEstado(
    @Args('estado_id', { type: () => ID }) estado_id: number,
  ): Promise<Solicitud[]> {
    return this.labTestsService.getSolicitudesPorEstado(estado_id);
  }

  @Mutation(() => EstadoSolicitud, {
    name: 'updateEstadoSolicitud',
    description: 'Actualizar un estado de solicitud existente',
  })
  async updateEstadoSolicitud(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateEstadoSolicitudInput,
  ): Promise<EstadoSolicitud> {
    return this.labTestsService.updateEstadoSolicitud(id, input);
  }

  @Mutation(() => EstadoSolicitud, {
    name: 'createEstadoSolicitud',
    description: 'Crear un nuevo estado de solicitud',
  })
  async createEstadoSolicitud(
    @Args('input') input: CreateEstadoSolicitudInput,
  ): Promise<EstadoSolicitud> {
    return this.labTestsService.createEstadoSolicitud(input);
  }

  @Query(() => TipoLaboratorio, {
    name: 'tipoLaboratorio',
    description: 'Obtener un tipo de laboratorio por ID',
  })
  async getTipoLaboratorio(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<TipoLaboratorio> {
    return this.labTestsService.findTipoLaboratorioById(id);
  }

  @Query(() => [TipoLaboratorio], {
    name: 'tiposLaboratorioActivos',
    description: 'Obtener todos los tipos de laboratorio activos',
  })
  async getTiposLaboratorioActivos(): Promise<TipoLaboratorio[]> {
    return this.labTestsService.getTiposLaboratorioActivos();
  }

  @Query(() => [TipoLaboratorio], {
    name: 'tiposLaboratorio',
    description: 'Obtener todos los tipos de laboratorio',
  })
  async getAllTiposLaboratorio(): Promise<TipoLaboratorio[]> {
    return this.labTestsService.getAllTiposLaboratorio();
  }

  @Mutation(() => TipoLaboratorio, {
    name: 'createTipoLaboratorio',
    description: 'Crear un nuevo tipo de laboratorio',
  })
  async createTipoLaboratorio(
    @Args('input') input: CreateTipoLaboratorioInput,
  ): Promise<TipoLaboratorio> {
    return this.labTestsService.createTipoLaboratorio(input);
  }

  @Mutation(() => TipoLaboratorio, {
    name: 'updateTipoLaboratorio',
    description: 'Actualizar un tipo de laboratorio existente',
  })
  async updateTipoLaboratorio(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateTipoLaboratorioInput,
  ): Promise<TipoLaboratorio> {
    return this.labTestsService.updateTipoLaboratorio(id, input);
  }

  @Query(() => [Resultado], {
    name: 'resultados',
    description: 'Obtener todos los resultados',
  })
  async getAllResultados(): Promise<Resultado[]> {
    return this.labTestsService.getAllResultados();
  }

  @Query(() => Resultado, {
    name: 'resultado',
    description: 'Obtener un resultado por ID',
  })
  async getResultado(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Resultado> {
    return this.labTestsService.findResultadoById(id);
  }

  @Mutation(() => Resultado, {
    name: 'createResultado',
    description: 'Crear un nuevo resultado',
  })
  async createResultado(
    @Args('input') input: CreateResultadoInput,
  ): Promise<Resultado> {
    console.log('Resolver - createResultado llamado con input:', input);
    return this.labTestsService.createResultado(input);
  }

  @Mutation(() => Resultado, {
    name: 'updateResultado',
    description: 'Actualizar un resultado existente',
  })
  async updateResultado(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateResultadoInput,
  ): Promise<Resultado> {
    console.log(
      'Resolver - updateResultado llamado con id e input:',
      id,
      input,
    );
    return this.labTestsService.updateResultado(id, input);
  }

  @Query(() => [TipoExamen], {
    name: 'tiposExamen',
    description: 'Obtener todos los tipos de examen',
  })
  async getAllTiposExamen(): Promise<TipoExamen[]> {
    return this.labTestsService.getAllTiposExamen();
  }

  @Query(() => TipoExamen, {
    name: 'tipoExamen',
    description: 'Obtener un tipo de examen por ID',
  })
  async getTipoExamen(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<TipoExamen> {
    return this.labTestsService.findTipoExamenById(id);
  }

  @Query(() => [TipoExamen], {
    name: 'tiposExamenActivos',
    description: 'Obtener todos los tipos de examen activos',
  })
  async getTiposExamenActivos(): Promise<TipoExamen[]> {
    return this.labTestsService.getTiposExamenActivos();
  }

  @Query(() => [TipoExamen], {
    name: 'tiposExamenActivosPorLaboratorio',
    description:
      'Obtener todos los tipos de examen activos por id de laboratorio',
  })
  async getTiposExamenActivosPorLaboratorio(
    @Args('idLaboratorio', { type: () => ID }) idLaboratorio: number,
  ): Promise<TipoExamen[]> {
    return this.labTestsService.getTiposExamenActivosPorLaboratorio(
      idLaboratorio,
    );
  }

  @Mutation(() => TipoExamen, {
    name: 'createTipoExamen',
    description: 'Crear un nuevo tipo de examen',
  })
  async createTipoExamen(
    @Args('input') input: CreateTipoExamenInput,
  ): Promise<TipoExamen> {
    return this.labTestsService.createTipoExamen(input);
  }

  @Mutation(() => TipoExamen, {
    name: 'updateTipoExamen',
    description: 'Actualizar un tipo de examen existente',
  })
  async updateTipoExamen(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateTipoExamenInput,
  ): Promise<TipoExamen> {
    return this.labTestsService.updateTipoExamen(id, input);
  }

  @Query(() => [ExamenSolicitud], {
    name: 'examenesSolicitud',
    description: 'Obtener todos los exámenes de una solicitud',
  })
  async getExamenesSolicitud(): Promise<ExamenSolicitud[]> {
    return this.labTestsService.getExamenesSolicitud();
  }

  @Query(() => [ExamenSolicitud], {
    name: 'examenesPorSolicitud',
    description: 'Obtener todos los exámenes por ID de solicitud',
  })
  async getExamenesPorSolicitud(
    @Args('solicitudId', { type: () => ID }) solicitudId: number,
  ): Promise<ExamenSolicitud[]> {
    return this.labTestsService.getExamenesPorSolicitud(solicitudId);
  }

  @Query(() => [ExamenSolicitud], {
    name: 'examenPorTipoExamen',
    description: 'Obtener todos los exámenes por ID de tipo de examen',
  })
  async getExamenPorTipoExamen(
    @Args('tipoExamenId', { type: () => ID }) tipoExamenId: number,
  ): Promise<ExamenSolicitud[]> {
    return this.labTestsService.getExamenPorTipoExamen(tipoExamenId);
  }

  @Query(() => ExamenSolicitud, {
    name: 'examenSolicitud',
    description: 'Obtener un examen de solicitud por ID',
  })
  async getExamenSolicitud(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<ExamenSolicitud> {
    return this.labTestsService.findExamenSolicitudById(id);
  }

  @Mutation(() => ExamenSolicitud, {
    name: 'createExamenSolicitud',
    description: 'Crear un nuevo examen de solicitud',
  })
  async createExamenSolicitud(
    @Args('input') input: CreateExamenSolicitudInput,
  ): Promise<ExamenSolicitud> {
    console.log('Resolver - createExamenSolicitud llamado con input:', input);
    return this.labTestsService.createExamenSolicitud(input);
  }

  @Mutation(() => ExamenSolicitud, {
    name: 'updateExamenSolicitud',
    description: 'Actualizar un examen de solicitud existente',
  })
  async updateExamenSolicitud(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateExamenSolicitudInput,
  ): Promise<ExamenSolicitud> {
    console.log(
      'Resolver - updateExamenSolicitud llamado con id e input:',
      id,
      input,
    );
    return this.labTestsService.updateExamenSolicitud(id, input);
  }
}
