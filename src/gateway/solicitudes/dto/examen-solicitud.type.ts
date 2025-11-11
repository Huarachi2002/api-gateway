import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ExamenSolicitud {
  @Field()
  id: number;

  @Field()
  solicitud_id: number;

  @Field()
  tipo_examen_id: number;
}
