import { ObjectType, Field, ID } from '@nestjs/graphql';
// import { LabTest } from '../../solicitudes/dto/resultado.type';

@ObjectType()
export class Patient {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field()
  foto_carnet_b64: string;

  @Field({ nullable: true })
  telefono_whatsapp?: string;

  @Field({ nullable: true })
  datos_biometricos?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  // Relación con Lab Tests (otro microservicio)
  // @Field(() => [LabTest], { nullable: true })
  // labTests?: LabTest[];
}
