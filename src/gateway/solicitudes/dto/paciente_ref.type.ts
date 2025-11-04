import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Paciente_Ref {
  @Field()
  paciente_id: string;

  @Field()
  nombre: string;
}
