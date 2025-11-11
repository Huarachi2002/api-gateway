import { ObjectType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class EstadoSolicitud {
  @Field()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsNotEmpty()
  descripcion: string;
}
