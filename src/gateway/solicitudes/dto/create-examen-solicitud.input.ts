import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateExamenSolicitudInput {
  @Field()
  @IsNotEmpty({ message: 'El ID de la solicitud es requerido' })
  @IsNumber()
  solicitudId: number;

  @Field()
  @IsNotEmpty({ message: 'El ID del tipo de examen es requerido' })
  @IsNumber()
  tipoExamenId: number;
}
