import { Field, InputType } from "type-graphql";

@InputType()
export class UsernameAndPasswordInput {
  @Field()
  email!: string;
  @Field()
  username!: string;
  @Field()
  password!: string;
}
