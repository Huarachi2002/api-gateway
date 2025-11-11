import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateResultadoInput {
  @Field()
  @IsNotEmpty({ message: 'El paciente_id es requerido' })
  @IsDate()
  fechaPublicacion: Date;

  @Field()
  @IsNotEmpty({ message: 'El idSolicitud es requerido' })
  @IsNumber()
  idSolicitud: number;

  @Field()
  @IsNotEmpty({ message: 'La urlPdfResultado es requerida' })
  @IsString()
  urlPdfResultado: string;
}
