import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Patient } from './dto/paciente.type';
import { CreatePatientInput } from './dto/create-paciente.input';
import { UpdatePatientInput } from './dto/update-paciente.input';

@Injectable()
export class PatientsService {
  private readonly baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    // URL del microservicio de pacientes (Spring Boot, FastAPI, etc.)
    this.baseUrl =
      this.configService.get('PATIENTS_SERVICE_URL') ||
      'http://localhost:8080/api/patients';
  }

  /**
   * Obtener paciente por ID
   * Llama a: GET http://patient-service:8080/api/patients/{id}
   *
   * Ejemplo de respuesta del microservicio:
   * {
   *   "id": "123",
   *   "name": "Juan Pérez",
   *   "email": "juan@example.com",
   *   "age": 30,
   *   "phone": "+591 70123456",
   *   "address": "Av. Banzer 123",
   *   "isActive": true,
   *   "createdAt": "2025-11-04T10:30:00Z"
   * }
   */
  async findById(id: string): Promise<Patient> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Patient>(`${this.baseUrl}/${id}`),
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 404) {
        throw new HttpException('Paciente no encontrado', 404);
      }
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al obtener paciente: ${error.message}`,
        500,
      );
    }
  }

  /**
   * Listar todos los pacientes con paginación
   * Llama a: GET http://patient-service:8080/api/patients?limit=10&offset=0
   */
  async findAll(limit = 10, offset = 0): Promise<Patient[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Patient[]>(
          `${this.baseUrl}?limit=${limit}&offset=${offset}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al listar pacientes: ${error.message}`,
        500,
      );
    }
  }

  /**
   * Buscar pacientes por nombre o email
   * Llama a: GET http://patient-service:8080/api/patients/search?query=juan
   */
  async search(query: string): Promise<Patient[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Patient[]>(
          `${this.baseUrl}/search?query=${query}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al buscar pacientes: ${error.message}`,
        500,
      );
    }
  }

  /**
   * Crear nuevo paciente
   * Llama a: POST http://patient-service:8080/api/patients
   *
   * Body: {
   *   "name": "María García",
   *   "email": "maria@example.com",
   *   "age": 28,
   *   "phone": "+591 70987654",
   *   "address": "Calle Libertad 456"
   * }
   */
  async create(input: CreatePatientInput): Promise<Patient> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<Patient>(this.baseUrl, input),
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 409) {
        throw new HttpException('El email ya está registrado', 409);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new HttpException(`Error al crear paciente: ${error.message}`, 500);
    }
  }

  /**
   * Actualizar paciente existente
   * Llama a: PUT http://patient-service:8080/api/patients/{id}
   */
  async update(id: string, input: UpdatePatientInput): Promise<Patient> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<Patient>(`${this.baseUrl}/${id}`, input),
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 404) {
        throw new HttpException('Paciente no encontrado', 404);
      }
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al actualizar paciente: ${error.message}`,
        500,
      );
    }
  }

  /**
   * Eliminar paciente (soft delete)
   * Llama a: DELETE http://patient-service:8080/api/patients/{id}
   */
  async delete(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpService.delete(`${this.baseUrl}/${id}`));
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('Paciente no encontrado', 404);
      }
      throw new HttpException(
        `Error al eliminar paciente: ${error.message}`,
        500,
      );
    }
  }

  /**
   * Obtener estadísticas de pacientes
   * Llama a: GET http://patient-service:8080/api/patients/stats
   */
  async getStats(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/stats`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error al obtener estadísticas: ${error.message}`,
        500,
      );
    }
  }
}
