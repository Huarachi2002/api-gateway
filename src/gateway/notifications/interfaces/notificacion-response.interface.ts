import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificacionResponse {
  @Field(() => String, { nullable: true })
  success?: string;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  data?: string;

  @Field(() => String, { nullable: true })
  timestamp?: string;
}
