import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Rol {
  @Field()
  _id: string;

  @Field()
  descripcion: string;

  @Field()
  estado: boolean;
}
