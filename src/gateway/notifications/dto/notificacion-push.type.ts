import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificacionPush {
  @Field()
  tipo: string;

  @Field()
  solicitudId: string;

  @Field()
  pacienteId: string;

  @Field()
  url: string;

  @Field()
  fecha: string;
}
