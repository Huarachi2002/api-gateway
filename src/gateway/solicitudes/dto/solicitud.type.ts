import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Solicitud {
  @Field()
  id: number;

  @Field()
  paciente_id: string;

  @Field()
  estado_solicitud_id: number;

  @Field()
  fecha_asistencia: Date;

  @Field()
  estado: string;

  @Field()
  recomendacion: string;

  @Field()
  url_foto_orden: string;
}
