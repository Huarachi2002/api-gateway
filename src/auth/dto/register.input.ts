import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @Field(() => String)
  @IsEnum(Role, { message: 'El rol debe ser válido' })
  role: Role;
}
