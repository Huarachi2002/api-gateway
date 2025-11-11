import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateTipoExamenInput {
  @Field()
  @IsNotEmpty({ message: 'El id del tipo de laboratorio es requerido' })
  @IsNumber()
  idTipoLaboratorio: number;

  @Field()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString()
  descripcion: string;

  @Field()
  @IsNotEmpty({ message: 'El estado es requerido' })
  estado: boolean;
}
