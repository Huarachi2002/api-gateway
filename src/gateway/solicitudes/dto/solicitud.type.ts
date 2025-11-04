import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Solicitud {
  @Field()
  solicitud_id: number;

  @Field()
  paciente_id: string;

  @Field()
  fecha_creacion: Date;

  @Field()
  estado: string;

  @Field()
  url_foto_orden: string;
}
