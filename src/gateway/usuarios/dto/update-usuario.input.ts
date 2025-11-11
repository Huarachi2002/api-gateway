import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUsuarioInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  contrasena?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  idRol?: string;
}
