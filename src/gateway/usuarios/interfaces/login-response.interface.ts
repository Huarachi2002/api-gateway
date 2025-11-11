import { Field, ObjectType } from '@nestjs/graphql';
import { Usuario } from '../dto/usuario.type';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => Usuario)
  usuario: Usuario;

  @Field({ nullable: true })
  expiresIn?: number;
}
