import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateEstadoSolicitudInput {
  @Field()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString()
  descripcion: string;
}
