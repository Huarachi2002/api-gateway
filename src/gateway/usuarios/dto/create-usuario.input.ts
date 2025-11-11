import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  @IsNumber()
  idPaciente: number;

  @Field()
  @IsOptional()
  @IsString()
  tokenFcm: string;

  @Field()
  @IsString()
  idRol: string;
}
