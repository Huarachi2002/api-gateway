import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Resultado } from './dto/resultado.type';
import { Paciente } from './dto/paciente.type';
import { CreatePacienteInput } from './dto/create-paciente.input';
import { Response as BackendResponse } from '../../common/interfaces/reponse.interface';

@Injectable()
export class LabTestsService {
  private readonly baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    // URL del microservicio de análisis de laboratorio (FastAPI, Spring Boot, etc.)
    this.baseUrl = 'http://192.168.0.112:8080/api';
  }

  async findPatientById(id: string): Promise<Paciente> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<any>>(`${this.baseUrl}/pacientes/${id}`),
      );
      
      // Extraer los datos del formato del backend
      const backendData = response.data.data || response.data;
      
      // Transformar la respuesta al formato esperado por GraphQL
      const paciente: Paciente = {
        id: String(backendData.id),
        nombre: backendData.nombre,
        apellido: backendData.apellido,
        correo: backendData.correo,
        direccion: backendData.direccion,
        telefono: backendData.telefono,
        fechaNacimiento: backendData.fechaNacimiento || backendData.fecha_nacimiento || '',
      };
      
      return paciente;
    } catch (error) {
      throw new HttpException('Paciente no encontrado', 404);
    }
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
   * Crear nuevo paciente
   * Llama a: POST http://labtest-service:8080/api/pacientes
   */
  async createPaciente(data: CreatePacienteInput): Promise<Paciente> {
    try {
      console.log('=== INICIO createPaciente ===');
      console.log('Datos recibidos:', JSON.stringify(data, null, 2));
      console.log('URL del servicio:', `${this.baseUrl}/pacientes`);
      
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<Paciente>>(`${this.baseUrl}/pacientes`, data),
      );
      
      console.log('Status de respuesta:', response.status);
      console.log('Datos de respuesta:', JSON.stringify(response.data, null, 2));
      
      // Validar el status code manualmente ya que validateStatus: true acepta todo
      if (response.status >= 200 && response.status < 300) {
        console.log('✅ Paciente creado exitosamente');
        
        // Extraer los datos del formato del backend
        const backendData = response.data.data;
        
        // Transformar la respuesta al formato esperado por GraphQL
        const paciente: Paciente = {
          id: String(backendData.id), // Convertir número a string
          nombre: backendData.nombre,
          apellido: backendData.apellido,
          correo: backendData.correo,
          direccion: backendData.direccion,
          telefono: backendData.telefono,
          fechaNacimiento: backendData.fechaNacimiento || '',
        };
        
        console.log('Paciente transformado:', JSON.stringify(paciente, null, 2));
        return paciente;
      } else if (response.status === 400) {
        throw new HttpException(
          `Datos inválidos: ${(response.data as any)?.message || 'Error de validación'}`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (response.status === 409) {
        throw new HttpException(
          'El paciente ya existe',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          (response.data as any)?.message || 'Error al crear paciente',
          response.status,
        );
      }
    } catch (error) {
      console.error('=== ERROR EN createPaciente ===');
      console.error('Tipo de error:', error?.constructor?.name);
      console.error('Mensaje:', error?.message);
      
      // Si ya es una HttpException, re-lanzarla
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Manejar errores de Axios
      if (error?.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        const status = error.response.status;
        const message = error.response.data?.message || 'Error al crear paciente';
        
        if (status === 400) {
          throw new HttpException(
            `Datos inválidos: ${message}`,
            HttpStatus.BAD_REQUEST,
          );
        } else if (status === 409) {
          throw new HttpException(
            'El paciente ya existe',
            HttpStatus.CONFLICT,
          );
        } else {
          throw new HttpException(
            message,
            status,
          );
        }
      } else if (error?.request) {
        console.error('No hubo respuesta del servidor');
        console.error('Request:', error.request);
        throw new HttpException(
          'No se pudo conectar con el servicio de pacientes. Verifica que el servidor en http://192.168.0.112:8080 esté activo.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        console.error('Error al configurar la petición');
        console.error('Stack:', error?.stack);
        throw new HttpException(
          `Error interno: ${error?.message || 'Error desconocido'}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updatePaciente(id: string, data: any): Promise<Paciente> {
    try {
      console.log('=== INICIO updatePaciente ===');
      console.log('ID del paciente:', id);
      console.log('Datos recibidos para actualización:', JSON.stringify(data, null, 2));
      console.log('URL del servicio:', `${this.baseUrl}/pacientes/${id}`);
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<Paciente>>(`${this.baseUrl}/pacientes/${id}`, data),
      );

      console.log('Status de respuesta:', response.status);
      console.log('Datos de respuesta:', JSON.stringify(response.data, null, 2));

      if (response.status >= 200 && response.status < 300) {
        console.log('✅ Paciente actualizado exitosamente');

        const backendData = response.data.data;

        const paciente: Paciente = {
          id: String(backendData.id),
          nombre: backendData.nombre,
          apellido: backendData.apellido,
          correo: backendData.correo,
          direccion: backendData.direccion,
          telefono: backendData.telefono,
          fechaNacimiento: backendData.fechaNacimiento || '',
        };

        console.log('Paciente transformado:', JSON.stringify(paciente, null, 2));
        return paciente;
      }else if (response.status === 400) {
        throw new HttpException(
          `Datos inválidos: ${(response.data as any)?.message || 'Error de validación'}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          (response.data as any)?.message || 'Error al actualizar paciente',
          response.status,
        );
      }
    } catch (error) {
      console.error('=== ERROR EN updatePaciente ===');
      console.error('Tipo de error:', error?.constructor?.name);
      console.error('Mensaje:', error?.message);

      if (error instanceof HttpException) {
        throw error;
      }

      if (error?.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);

        const status = error.response.status;
        const message = error.response.data?.message || 'Error al actualizar paciente';

        if (status === 400) {
          throw new HttpException(
            `Datos inválidos: ${message}`,
            HttpStatus.BAD_REQUEST,
          );
        } else if (status === 404) {
          throw new HttpException(
            'El paciente no existe',
            HttpStatus.NOT_FOUND,
          );
        } else {
          throw new HttpException(
            message,
            status,
          );
        }
      } else if (error?.request) {
        console.error('No hubo respuesta del servidor');
        console.error('Request:', error.request);
        throw new HttpException(
          'No se pudo conectar con el servicio de pacientes. Verifica que el servidor en http://localhost:3000 esté en funcionamiento',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        console.error('Error al configurar la petición');
        console.error('Stack:', error?.stack);
        throw new HttpException(
          `Error interno: ${error?.message || 'Error desconocido'}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
