import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateSolicitudInput {
  @Field()
  @IsNotEmpty({ message: 'El paciente_id es requerido' })
  @IsNumber()
  paciente_id: number;

  @Field()
  @IsNotEmpty({ message: 'El estado_id es requerido' })
  @IsNumber()
  estado_id: number;

  @Field()
  @IsNotEmpty({ message: 'La url_foto_orden es requerida' })
  @IsString()
  url_foto_orden: string;
}
