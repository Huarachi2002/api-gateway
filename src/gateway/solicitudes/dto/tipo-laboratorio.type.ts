import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TipoLaboratorio {
  @Field()
  id: number;

  @Field()
  descripcion: string;

  @Field()
  estado: boolean;
}
