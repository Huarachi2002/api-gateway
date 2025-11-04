import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdatePatientInput {
  @Field({ nullable: true })
  @IsOptional()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  apellido?: string;

  @Field({ nullable: true })
  @IsOptional()
  foto_carnet_b64?: string;

  @Field({ nullable: true })
  @IsOptional()
  telefono_whatsapp?: string;

  @Field({ nullable: true })
  @IsOptional()
  datos_biometricos?: string;
}
