import { User } from "../entities/User";
import { MyContext } from "../types";
import { UsernameAndPasswordInput } from "./UsernameAndPasswordInput";
import { FieldError } from "./FieldError";
declare class UserResponse {
    errors?: FieldError[];
    user?: User;
}
export declare class UserResolver {
    email({ id, email }: User, { req }: MyContext): string;
    changePassword(token: string, newPassword: string, { redis, req }: MyContext): Promise<UserResponse>;
    forgotPassord(email: string, { redis }: MyContext): Promise<boolean>;
    me({ req }: MyContext): Promise<User | undefined>;
    register({ req }: MyContext, options: UsernameAndPasswordInput): Promise<UserResponse>;
    login({ req }: MyContext, usernameOrEmail: string, password: string): Promise<UserResponse>;
    logout({ req, res }: MyContext): Promise<boolean>;
}
export {};
