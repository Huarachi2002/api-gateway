import { InputType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class NotificacionPushInput {
  @Field(() => [String], {
    description: 'Array de tokens de dispositivos para enviar la notificación',
  })
  @IsArray({ message: 'tokens debe ser un array' })
  @IsString({ each: true, message: 'Cada token debe ser un string' })
  @IsNotEmpty({ message: 'tokens no puede estar vacío' })
  tokens: string[];

  @Field(() => String, {
    description: 'Título de la notificación',
  })
  @IsString()
  @IsNotEmpty({ message: 'title no puede estar vacío' })
  title: string;

  @Field(() => String, {
    description: 'Cuerpo del mensaje de la notificación',
  })
  @IsString()
  @IsNotEmpty({ message: 'body no puede estar vacío' })
  body: string;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: 'Datos adicionales opcionales en formato JSON',
  })
  @IsOptional()
  @IsObject({ message: 'data debe ser un objeto JSON' })
  data?: Record<string, any>;
}
