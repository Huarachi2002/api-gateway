import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

@InputType()
export class UpdateTipoExamenInput {
  @Field()
  @IsOptional()
  @IsNumber()
  idTipoLaboratorio: number;

  @Field()
  @IsOptional()
  @IsString()
  descripcion: string;

  @Field()
  @IsOptional()
  @IsBoolean()
  estado: boolean;
}
