import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NotificacionService } from './notifications.service';
import { NotificacionPushInput } from './dto/notificacion-push.input';
import { NotificacionResponse } from './interfaces/notificacion-response.interface';

/**
 * 📲 NOTIFICATIONS RESOLVER
 * 
 * Este resolver maneja el envío de notificaciones push.
 * Se comunica con el microservicio de notificaciones.
 * 
 * Ejemplo de uso en Postman:
 * {
 *   "query": "mutation SendPush($input: NotificacionPushInput!) { notificacionPush(input: $input) { success message timestamp } }",
 *   "variables": {
 *     "input": {
 *       "tokens": ["token1", "token2"],
 *       "title": "Nueva Solicitud",
 *       "body": "Tienes una nueva solicitud de análisis",
 *       "data": { "solicitudId": "123", "tipo": "urgente" }
 *     }
 *   }
 * }
 */
@Resolver()
export class NotificacionResolver {
  constructor(private notificacionService: NotificacionService) {}

  @Mutation(() => NotificacionResponse, {
    name: 'notificacionPush',
    description: 'Enviar una notificación push a uno o varios dispositivos',
  })
  async sendNotificacionPush(
    @Args('input') input: NotificacionPushInput,
  ): Promise<NotificacionResponse> {
    console.log('📲 Resolver - sendNotificacionPush llamado con input:', input);
    return this.notificacionService.sendNotificacionPush(input);
  }
}
