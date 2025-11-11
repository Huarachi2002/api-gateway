import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateTipoLaboratorioInput {
  @Field()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString()
  descripcion: string;

  @Field()
  @IsNotEmpty({ message: 'El estado es requerido' })
  estado: boolean;
}
