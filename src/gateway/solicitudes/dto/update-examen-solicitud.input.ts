import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateExamenSolicitudInput {
  @Field()
  @IsOptional()
  @IsString()
  solicitudId: number;

  @Field()
  @IsOptional()
  @IsString()
  tipoExamenId: number;
}
