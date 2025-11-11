import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsString, IsDate } from 'class-validator';

@InputType()
export class UpdateResultadoInput {
  @Field()
  @IsOptional()
  @IsDate()
  fechaPublicacion: Date;

  @Field()
  @IsOptional()
  @IsNumber()
  idSolicitud: number;

  @Field()
  @IsOptional()
  @IsString()
  urlPdfResultado: string;
}
