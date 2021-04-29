import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Ctx,
  Field,
  Resolver,
  Arg,
  Mutation,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { UsernameAndPasswordInput } from "./UsernameAndPasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { FieldError } from "./FieldError";
import { v4 } from "uuid";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() { id, email }: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === id) {
      return email;
    }
    return "";
  }
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length < 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password is too short",
          },
        ],
      };
    }
    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const user = await User.findOne(parseInt(userId));
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user doesnt longer exists",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(newPassword);
    await User.update({ id: parseInt(userId) }, { password: hashedPassword });
    await redis.del(FORGET_PASSWORD_PREFIX + token);
    req.session.userId = user.id;
    return { user };
  }
  @Mutation(() => Boolean)
  async forgotPassord(
    @Arg("email") email: string,
    @Ctx()
    { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );
    await sendEmail(
      user.email,
      `<div><a href="http://localhost:3000/change-password/${token}">forgot password</a></div>`
    );
    return true;
  }
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    }
    const user = await User.findOne({ id: req.session.userId });
    return user;
  }
  @Mutation(() => UserResponse)
  async register(
    @Ctx() { req }: MyContext,
    @Arg("options") options: UsernameAndPasswordInput
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    try {
      const user = await User.create({
        username: options.username,
        password: hashedPassword,
        email: options.email,
      }).save();
      req.session.userId = user.id;
      return { user };
    } catch (err) {
      console.log(err);
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
      return {
        errors: [
          {
            field: "username",
            message: err as string,
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { req }: MyContext,
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exists",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session.userId = user.id;
    return {
      user,
    };
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve: (val: boolean) => void) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        } else {
          resolve(true);
          return;
        }
      })
    );
  }
}
