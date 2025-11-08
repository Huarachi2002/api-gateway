import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreatePacienteInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @Field()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString()
  apellido: string;

  @Field()
  @IsEmail({}, { message: 'Debe proporcionar un correo válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo: string;

  @Field()
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString()
  direccion: string;

  @Field()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString()
  telefono: string;

  @Field()
  @IsNotEmpty({ message: 'La fecha de nacimiento es requerida' })
  @IsString()
  fechaNacimiento: string;
}
