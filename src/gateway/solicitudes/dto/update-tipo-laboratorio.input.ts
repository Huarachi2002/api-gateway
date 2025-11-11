import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class UpdateTipoLaboratorioInput {
  @Field()
  @IsOptional()
  @IsString()
  descripcion: string;

  @Field()
  @IsOptional()
  @IsBoolean()
  estado: boolean;
}
