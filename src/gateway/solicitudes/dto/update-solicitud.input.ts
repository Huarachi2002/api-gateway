import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateSolicitudInput {
  @Field()
  @IsOptional()
  @IsNumber()
  paciente_id: number;

  @Field()
  @IsOptional()
  @IsNumber()
  estado_id: number;

  @Field()
  @IsOptional()
  @IsString()
  url_foto_orden: string;
}
