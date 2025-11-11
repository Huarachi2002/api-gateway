import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Resultado } from './dto/resultado.type';
import { Paciente } from './dto/paciente.type';
import { CreatePacienteInput } from './dto/create-paciente.input';
import { Response as BackendResponse } from '../../common/interfaces/reponse.interface';
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

@Injectable()
export class LabTestsService {
  private readonly baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    // URL del microservicio de análisis de laboratorio (FastAPI, Spring Boot, etc.)
    this.baseUrl = `${configService.get<string>('LAB_TESTS_SERVICE_URL')}/api` || 'localhost:8080/api';
    // this.baseUrl = 'https://wghjd5th-8080.brs.devtunnels.ms/api';
  }

  async getAllPacientes(): Promise<Paciente[]> {
    try {
      console.log('=== INICIO getAllPacientes ===');
      console.log('URL del servicio:', `${this.baseUrl}/pacientes`);
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Paciente[]>>(
          `${this.baseUrl}/pacientes`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw new HttpException(
        'No se pudieron obtener los pacientes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findPatientById(id: string): Promise<Paciente> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Paciente>>(
          `${this.baseUrl}/pacientes/${id}`,
        ),
      );

      // Extraer los datos del formato del backend
      const backendData = response.data.data;

      // Transformar la respuesta al formato esperado por GraphQL
      const paciente: Paciente = {
        id: String(backendData.id),
        nombre: backendData.nombre,
        apellido: backendData.apellido,
        correo: backendData.correo,
        direccion: backendData.direccion,
        telefono: backendData.telefono,
        fechaNacimiento: backendData.fechaNacimiento || '',
      };

      return paciente;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException('Paciente no encontrado', 404);
    }
  }

  async getSolicitudesPorEstado(estadoId: number): Promise<Solicitud[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Solicitud[]>>(
          `${this.baseUrl}/estados-solicitud/${estadoId}/solicitudes`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener las solicitudes por estado',
        500,
      );
    }
  }

  async getAllEstadosSolicitud(): Promise<EstadoSolicitud[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<EstadoSolicitud[]>>(
          `${this.baseUrl}/estados-solicitud`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los estados de solicitud',
        500,
      );
    }
  }

  async findEstadoSolicitudById(id: number): Promise<EstadoSolicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<EstadoSolicitud>>(
          `${this.baseUrl}/estados-solicitud/${id}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('Estado de solicitud no encontrado', 404);
    }
  }

  async updateSolicitud(
    id: number,
    input: UpdateSolicitudInput,
  ): Promise<Solicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<Solicitud>>(
          `${this.baseUrl}/solicitudes/${id}`,
          input,
        ),
      );
      return response.data.data || null;
    } catch (error) {
      throw new HttpException('No se pudo actualizar la solicitud', 500);
    }
  }

  async createEstadoSolicitud(
    input: CreateEstadoSolicitudInput,
  ): Promise<EstadoSolicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<EstadoSolicitud>>(
          `${this.baseUrl}/estados-solicitud`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        'No se pudo crear el estado de la solicitud',
        500,
      );
    }
  }

  async createSolicitud(input: CreateSolicitudInput): Promise<Solicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<Solicitud>>(
          `${this.baseUrl}/solicitudes`,
          input,
        ),
      );
      return response.data.data || null;
    } catch (error) {
      throw new HttpException('No se pudo crear la solicitud', 500);
    }
  }

  async getAllSolicitudes(): Promise<Solicitud[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Solicitud[]>>(
          `${this.baseUrl}/solicitudes`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException('No se pudieron obtener las solicitudes', 500);
    }
  }

  async findResultadoBySolicitudId(solicitudId: string): Promise<Resultado> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Resultado>>(
          `${this.baseUrl}/solicitudes/${solicitudId}/resultado`,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('Resultado no encontrado', 404);
    }
  }

  async findSolicitudById(id: string): Promise<Solicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Solicitud>>(
          `${this.baseUrl}/solicitudes/${id}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('Solicitud no encontrada', 404);
    }
  }

  async findTipoLaboratorioById(id: number): Promise<TipoLaboratorio> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<TipoLaboratorio>>(
          `${this.baseUrl}/tipos-laboratorio/${id}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('Solicitud no encontrada', 404);
    }
  }

  async getTiposLaboratorioActivos(): Promise<TipoLaboratorio[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<TipoLaboratorio[]>>(
          `${this.baseUrl}/tipos-laboratorio?estado=true`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los tipos de laboratorio activos',
        500,
      );
    }
  }

  async getAllTiposLaboratorio(): Promise<TipoLaboratorio[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<TipoLaboratorio[]>>(
          `${this.baseUrl}/tipos-laboratorio`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los tipos de laboratorio',
        500,
      );
    }
  }

  async createTipoLaboratorio(
    input: CreateTipoLaboratorioInput,
  ): Promise<TipoLaboratorio> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<TipoLaboratorio>>(
          `${this.baseUrl}/tipos-laboratorio`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('No se pudo crear el tipo de laboratorio', 500);
    }
  }

  async updateTipoLaboratorio(
    id: number,
    input: UpdateTipoLaboratorioInput,
  ): Promise<TipoLaboratorio> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<TipoLaboratorio>>(
          `${this.baseUrl}/tipos-laboratorio/${id}`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        'No se pudo actualizar el tipo de laboratorio',
        500,
      );
    }
  }

  async updateEstadoSolicitud(
    id: number,
    input: UpdateEstadoSolicitudInput,
  ): Promise<EstadoSolicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<EstadoSolicitud>>(
          `${this.baseUrl}/estados-solicitud/${id}`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        'No se pudo actualizar el estado de la solicitud',
        500,
      );
    }
  }

  async getAllResultados(): Promise<Resultado[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Resultado[]>>(
          `${this.baseUrl}/resultados`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException('No se pudieron obtener los resultados', 500);
    }
  }

  async findResultadoById(id: string): Promise<Resultado> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Resultado>>(
          `${this.baseUrl}/resultados/${id}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('Resultado no encontrado', 404);
    }
  }

  async createResultado(input: CreateResultadoInput): Promise<Resultado> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<Resultado>>(
          `${this.baseUrl}/resultados`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('No se pudo crear el resultado', 500);
    }
  }

  async updateResultado(
    id: string,
    input: UpdateResultadoInput,
  ): Promise<Resultado> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<Resultado>>(
          `${this.baseUrl}/resultados/${id}`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('No se pudo actualizar el resultado', 500);
    }
  }

  async findTipoExamenById(id: number): Promise<TipoExamen> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<TipoExamen>>(
          `${this.baseUrl}/tipos-examen/${id}`,
        ),
      );
      return response.data.data || null;
    } catch (error) {
      throw new HttpException('Tipo de examen no encontrado', 404);
    }
  }

  async getTiposExamenActivos(): Promise<TipoExamen[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<TipoExamen[]>>(
          `${this.baseUrl}/tipos-examen/activos`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los tipos de examen activos',
        500,
      );
    }
  }

  async getTiposExamenActivosPorLaboratorio(
    idLaboratorio: number,
  ): Promise<TipoExamen[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<TipoExamen[]>>(
          `${this.baseUrl}/tipos-examen/laboratorio/${idLaboratorio}/activos`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los tipos de examen activos por laboratorio',
        500,
      );
    }
  }

  async createTipoExamen(input: CreateTipoExamenInput): Promise<TipoExamen> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<TipoExamen>>(
          `${this.baseUrl}/tipos-examen`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('No se pudo crear el tipo de examen', 500);
    }
  }

  async updateTipoExamen(
    id: number,
    input: UpdateTipoExamenInput,
  ): Promise<TipoExamen> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<TipoExamen>>(
          `${this.baseUrl}/tipos-examen/${id}`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('No se pudo actualizar el tipo de examen', 500);
    }
  }

  async getExamenesSolicitud(): Promise<ExamenSolicitud[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<ExamenSolicitud[]>>(
          `${this.baseUrl}/examenes-solicitud`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los exámenes de solicitud',
        500,
      );
    }
  }

  async getExamenesPorSolicitud(
    solicitudId: number,
  ): Promise<ExamenSolicitud[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<ExamenSolicitud[]>>(
          `${this.baseUrl}/examenes-solicitud/solicitud/${solicitudId}`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los exámenes por solicitud',
        500,
      );
    }
  }

  async getExamenPorTipoExamen(
    tipoExamenId: number,
  ): Promise<ExamenSolicitud[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<ExamenSolicitud[]>>(
          `${this.baseUrl}/examenes-solicitud/tipo-examen/${tipoExamenId}`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los exámenes por tipo de examen',
        500,
      );
    }
  }

  async findExamenSolicitudById(id: number): Promise<ExamenSolicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<ExamenSolicitud>>(
          `${this.baseUrl}/examenes-solicitud/${id}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('No se pudo obtener el examen de solicitud', 500);
    }
  }

  async createExamenSolicitud(
    input: CreateExamenSolicitudInput,
  ): Promise<ExamenSolicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<ExamenSolicitud>>(
          `${this.baseUrl}/examenes-solicitud`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException('No se pudo crear el examen de solicitud', 500);
    }
  }

  async updateExamenSolicitud(
    id: number,
    input: UpdateExamenSolicitudInput,
  ): Promise<ExamenSolicitud> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<ExamenSolicitud>>(
          `${this.baseUrl}/examenes-solicitud/${id}`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        'No se pudo actualizar el examen de solicitud',
        500,
      );
    }
  }

  async getAllTiposExamen(): Promise<TipoExamen[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<TipoExamen[]>>(
          `${this.baseUrl}/tipos-examen`,
        ),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los tipos de examen',
        500,
      );
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        this.httpService.post<BackendResponse<Paciente>>(
          `${this.baseUrl}/pacientes`,
          data,
        ),
      );

      console.log('Status de respuesta:', response.status);
      console.log(
        'Datos de respuesta:',
        JSON.stringify(response.data, null, 2),
      );

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

        console.log(
          'Paciente transformado:',
          JSON.stringify(paciente, null, 2),
        );
        return paciente;
      } else if (response.status === 400) {
        throw new HttpException(
          `Datos inválidos: ${(response.data as any)?.message || 'Error de validación'}`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (response.status === 409) {
        throw new HttpException('El paciente ya existe', HttpStatus.CONFLICT);
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
        const message =
          error.response.data?.message || 'Error al crear paciente';

        if (status === 400) {
          throw new HttpException(
            `Datos inválidos: ${message}`,
            HttpStatus.BAD_REQUEST,
          );
        } else if (status === 409) {
          throw new HttpException('El paciente ya existe', HttpStatus.CONFLICT);
        } else {
          throw new HttpException(message, status);
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
      console.log(
        'Datos recibidos para actualización:',
        JSON.stringify(data, null, 2),
      );
      console.log('URL del servicio:', `${this.baseUrl}/pacientes/${id}`);
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<Paciente>>(
          `${this.baseUrl}/pacientes/${id}`,
          data,
        ),
      );

      console.log('Status de respuesta:', response.status);
      console.log(
        'Datos de respuesta:',
        JSON.stringify(response.data, null, 2),
      );

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

        console.log(
          'Paciente transformado:',
          JSON.stringify(paciente, null, 2),
        );
        return paciente;
      } else if (response.status === 400) {
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
        const message =
          error.response.data?.message || 'Error al actualizar paciente';

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
          throw new HttpException(message, status);
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
