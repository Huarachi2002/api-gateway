import { Field, ObjectType } from '@nestjs/graphql';
import { Rol } from './rol.type';

@ObjectType()
export class Usuario {
  @Field()
  _id: string;

  @Field()
  nombreUsuario: string;

  @Field()
  contrasena: string;

  @Field()
  activo: boolean;

  @Field()
  rol: Rol;
}
