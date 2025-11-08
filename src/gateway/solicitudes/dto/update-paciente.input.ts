import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdatePacienteInput {
  @Field()
  @IsOptional()
  @IsString()
  nombre: string;

  @Field()
  @IsOptional()
  @IsString()
  apellido: string;

  @Field()
  @IsEmail({}, { message: 'Debe proporcionar un correo válido' })
  @IsOptional()
  correo: string;

  @Field()
  @IsOptional()
  @IsString()
  direccion: string;

  @Field()
  @IsOptional()
  @IsString()
  telefono: string;

  @Field()
  @IsOptional()
  @IsString()
  fechaNacimiento: string;
}
