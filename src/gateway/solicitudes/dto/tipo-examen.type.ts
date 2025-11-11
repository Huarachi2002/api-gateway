import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TipoExamen {
  @Field()
  id: number;

  @Field()
  tipo_laboratorio_id: number;

  @Field()
  descripcion: string;

  @Field()
  estado: boolean;
}
