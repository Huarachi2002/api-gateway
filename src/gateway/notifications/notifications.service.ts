import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { NotificacionPushInput } from './dto/notificacion-push.input';
import { NotificacionResponse } from './interfaces/notificacion-response.interface';

@Injectable()
export class NotificacionService {
  private readonly baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    // URL del microservicio de usuarios (Spring Boot, FastAPI, etc.)
    this.baseUrl =
      // eslint-disable-next-line no-constant-binary-expression
      `${this.configService.get('NOTIFICATION_SERVICE_URL')}` ||
      'http://localhost:8002';
  }

  async sendNotificacionPush(
    input: NotificacionPushInput,
  ): Promise<NotificacionResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<NotificacionResponse>(
          `${this.baseUrl}/notification/send-push`,
          input,
        ),
      );
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.response?.status === 409) {
        throw new HttpException('El usuario ya está registrado', 409);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new HttpException(`Error al crear usuario: ${error.message}`, 500);
    }
  }
}
