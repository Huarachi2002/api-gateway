import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreatePatientInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @Field()
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  apellido: string;

  @Field()
  @IsNotEmpty({ message: 'La foto del carnet es requerida' })
  foto_carnet_b64: string;

  @Field({ nullable: true })
  @IsOptional()
  telefono_whatsapp?: string;

  @Field({ nullable: true })
  @IsOptional()
  datos_biometricos?: string;
}
