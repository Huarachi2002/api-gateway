import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@InputType()
export class CreateUsuarioInput {
  @Field()
  @IsString()
  nombreUsuario: string;

  @Field()
  @IsString()
  contrasena: string;

  @Field()
  @IsBoolean()
  activo: boolean;

  @Field()
  @IsString()
  idRol: string;
}
