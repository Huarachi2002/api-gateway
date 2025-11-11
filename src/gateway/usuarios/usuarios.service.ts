import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Usuario } from './dto/usuario.type';
import { Response as BackendResponse } from '../../common/interfaces/reponse.interface';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';
import { LoginResponse } from './interfaces/login-response.interface';
import { Rol } from './dto/rol.type';

@Injectable()
export class UsuariosService {
  private readonly baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    // URL del microservicio de usuarios (Spring Boot, FastAPI, etc.)
    this.baseUrl =
      `${this.configService.get('USUARIOS_SERVICE_URL')}/api` ||
      'http://localhost:3002/api';
  }

  async findById(id: string): Promise<Usuario> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Usuario>>(
          `${this.baseUrl}/users/${id}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 404) {
        throw new HttpException('Usuario no encontrado', 404);
      }
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al obtener usuario: ${error.message}`,
        500,
      );
    }
  }

  async findByPacienteId(idPaciente: number): Promise<Usuario> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Usuario>>(
          `${this.baseUrl}/users/paciente/${idPaciente}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 404) {
        throw new HttpException('Usuario no encontrado', 404);
      }
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al obtener usuario: ${error.message}`,
        500,
      );
    }
  }

  async getAllRoles(): Promise<Rol[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Rol[]>>(`${this.baseUrl}/roles`),
      );
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al obtener roles: ${error.message}`,
        500,
      );
    }
  }

  async getRolById(id: string): Promise<Rol> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Rol>>(
          `${this.baseUrl}/roles/${id}`,
        ),
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al obtener rol: ${error.message}`,
        500,
      );
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BackendResponse<Usuario[]>>(
          `${this.baseUrl}/users`,
        ),
      );
      console.log('Respuesta de findAll usuarios:', response.data);
      return response.data.data || [];
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al listar usuarios: ${error.message}`,
        500,
      );
    }
  }

  async createUser(input: CreateUsuarioInput): Promise<Usuario> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<Usuario>>(
          `${this.baseUrl}/users`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 409) {
        throw new HttpException('El usuario ya está registrado', 409);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new HttpException(`Error al crear usuario: ${error.message}`, 500);
    }
  }

  async updateUser(id: string, input: UpdateUsuarioInput): Promise<Usuario> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<BackendResponse<Usuario>>(
          `${this.baseUrl}/users/${id}`,
          input,
        ),
      );
      return response.data.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 404) {
        throw new HttpException('Usuario no encontrado', 404);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 409) {
        throw new HttpException(
          'El nombre de usuario ya está en uso. Por favor, elige otro nombre.',
          409,
        );
      }
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al actualizar usuario: ${error.message}`,
        500,
      );
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<LoginResponse>>(
          `${this.baseUrl}/auth/login`,
          { nombreUsuario: username, contrasena: password },
        ),
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new HttpException('Credenciales inválidas', 401);
      }
      throw new HttpException(`Error al iniciar sesión: ${error.message}`, 500);
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<BackendResponse<LoginResponse>>(
          `${this.baseUrl}/users/refresh`,
          { refreshToken },
        ),
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new HttpException('Token inválido o expirado', 401);
      }
      throw new HttpException(`Error al renovar token: ${error.message}`, 500);
    }
  }
}
