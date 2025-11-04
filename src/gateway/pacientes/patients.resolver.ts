import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { LabTestsService } from '../solicitudes/solicitudes.service';
import { Patient } from './dto/paciente.type';
// import { LabTest } from '../solicitudes/dto/resultado.type';
import { CreatePatientInput } from './dto/create-paciente.input';
import { UpdatePatientInput } from './dto/update-paciente.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { Resultado } from '../solicitudes/dto/resultado.type';

/**
 * 🏥 PATIENTS RESOLVER
 *
 * Este resolver expone operaciones GraphQL para gestionar pacientes.
 * Internamente, hace llamadas HTTP al microservicio de pacientes (Spring Boot/FastAPI).
 *
 * Flujo:
 * 1. Cliente envía query/mutation GraphQL
 * 2. Este resolver recibe la petición
 * 3. Llama al PatientsService
 * 4. PatientsService hace HTTP request al microservicio externo
 * 5. Respuesta del microservicio se devuelve al cliente
 */
@Resolver(() => Patient)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsResolver {
  constructor(
    private patientsService: PatientsService,
    private labTestsService: LabTestsService,
  ) {}

  // 📖 ========== QUERIES (Lectura) ==========

  /**
   * Obtener un paciente por ID
   *
   * GraphQL Query:
   * ```graphql
   * query {
   *   patient(id: "123") {
   *     id
   *     name
   *     email
   *   }
   * }
   * ```
   */
  @Query(() => Patient, {
    name: 'patient',
    description: 'Obtener un paciente por su ID',
  })
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.LABORATORY_TECH)
  async getPatient(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Patient> {
    return this.patientsService.findById(id);
  }

  /**
   * Listar todos los pacientes con paginación
   *
   * GraphQL Query:
   * ```graphql
   * query {
   *   patients(limit: 10, offset: 0) {
   *     id
   *     name
   *     email
   *   }
   * }
   * ```
   */
  @Query(() => [Patient], {
    name: 'patients',
    description: 'Listar todos los pacientes (con paginación)',
  })
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.LABORATORY_TECH)
  async getPatients(
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 10 })
    limit?: number,
    @Args('offset', { type: () => Number, nullable: true, defaultValue: 0 })
    offset?: number,
  ): Promise<Patient[]> {
    return this.patientsService.findAll(limit, offset);
  }

  /**
   * Buscar pacientes por nombre o email
   *
   * GraphQL Query:
   * ```graphql
   * query {
   *   searchPatients(query: "juan") {
   *     id
   *     name
   *     email
   *   }
   * }
   * ```
   */
  @Query(() => [Patient], {
    name: 'searchPatients',
    description: 'Buscar pacientes por nombre o email',
  })
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async searchPatients(
    @Args('query', { type: () => String }) query: string,
  ): Promise<Patient[]> {
    return this.patientsService.search(query);
  }

  // ✍️ ========== MUTATIONS (Escritura) ==========

  /**
   * Crear un nuevo paciente
   *
   * GraphQL Mutation:
   * ```graphql
   * mutation {
   *   createPatient(input: {
   *     name: "Juan Pérez"
   *     email: "juan@example.com"
   *     age: 30
   *     phone: "+591 70123456"
   *   }) {
   *     id
   *     name
   *     email
   *   }
   * }
   * ```
   */
  @Mutation(() => Patient, {
    description: 'Crear un nuevo paciente',
  })
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async createPatient(
    @Args('input') input: CreatePatientInput,
  ): Promise<Patient> {
    return this.patientsService.create(input);
  }

  /**
   * Actualizar un paciente existente
   *
   * GraphQL Mutation:
   * ```graphql
   * mutation {
   *   updatePatient(
   *     id: "123"
   *     input: {
   *       name: "Juan Pérez Actualizado"
   *       phone: "+591 70999999"
   *     }
   *   ) {
   *     id
   *     name
   *     phone
   *   }
   * }
   * ```
   */
  @Mutation(() => Patient, {
    description: 'Actualizar un paciente existente',
  })
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async updatePatient(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePatientInput,
  ): Promise<Patient> {
    return this.patientsService.update(id, input);
  }

  /**
   * Eliminar un paciente (soft delete)
   *
   * GraphQL Mutation:
   * ```graphql
   * mutation {
   *   deletePatient(id: "123")
   * }
   * ```
   */
  @Mutation(() => Boolean, {
    description: 'Eliminar un paciente',
  })
  @Roles(Role.ADMIN)
  async deletePatient(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.patientsService.delete(id);
  }

  // 🔗 ========== FIELD RESOLVERS (Relaciones) ==========

  /**
   * 🔥 IMPORTANTE: Este es el poder de GraphQL
   *
   * Este resolver se ejecuta SOLO si el cliente pide el campo 'labTests'
   * Permite hacer "lazy loading" de datos de otros microservicios
   *
   * GraphQL Query:
   * ```graphql
   * query {
   *   patient(id: "123") {
   *     id
   *     name
   *     labTests {  # ← Solo aquí se ejecuta este resolver
   *       id
   *       type
   *       status
   *     }
   *   }
   * }
   * ```
   *
   * Flujo:
   * 1. Se ejecuta getPatient() → llama a Patient Service (Spring Boot)
   * 2. Si cliente pidió 'labTests', se ejecuta este resolver
   * 3. Este resolver llama a Lab Tests Service (FastAPI)
   * 4. GraphQL combina ambas respuestas automáticamente
   */
  @ResolveField(() => [Resultado], {
    description: 'Análisis de laboratorio del paciente',
  })
  async labTests(@Parent() patient: Patient): Promise<Resultado[]> {
    // Llamar al microservicio de Lab Tests
    return this.labTestsService.findByPatientId(patient.id);
  }
}
