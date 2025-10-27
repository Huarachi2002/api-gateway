import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../../common/enums/role.enum';

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String)
  role: Role;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserType)
  user: UserType;
}
