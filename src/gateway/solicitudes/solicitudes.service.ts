import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Resultado } from './dto/resultado.type';

@Injectable()
export class LabTestsService {
  private readonly baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    // URL del microservicio de análisis de laboratorio (FastAPI, Spring Boot, etc.)
    this.baseUrl =
      this.configService.get('LABTESTS_SERVICE_URL') ||
      'http://localhost:8000/api/lab-tests';
  }

  /**
   * Obtener análisis de laboratorio por ID del paciente
   * Llama a: GET http://labtest-service:8000/api/lab-tests?patientId=123
   *
   * Este método es llamado por el Field Resolver de Patient
   * cuando el cliente pide el campo 'labTests' en una query
   */
  async findByPatientId(patientId: string): Promise<Resultado[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Resultado[]>(
          `${this.baseUrl}?patientId=${patientId}`,
        ),
      );
      return response.data;
    } catch (error) {
      // Si el microservicio no responde, devolver array vacío
      // para no romper la query completa
      console.error('Error al obtener lab tests:', error);
      return [];
    }
  }

  /**
   * Obtener un análisis por ID
   */
  async findById(id: string): Promise<Resultado> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Resultado>(`${this.baseUrl}/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Análisis no encontrado', 404);
    }
  }

  /**
   * Crear nuevo análisis de laboratorio
   */
  async create(data: any): Promise<Resultado> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<Resultado>(this.baseUrl, data),
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Error al crear análisis', 500);
    }
  }
}
