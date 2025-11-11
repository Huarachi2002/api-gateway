import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginUsuarioInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
  nombreUsuario: string;

  @Field()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  contrasena: string;

  @Field({ nullable: true })
  tokenFcm?: string;
}
