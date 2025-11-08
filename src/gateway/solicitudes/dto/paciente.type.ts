import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Paciente {
  @Field()
  id: string;

  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field()
  correo: string;

  @Field()
  direccion: string;

  @Field()
  telefono: string;

  @Field()
  fechaNacimiento: string;
}
