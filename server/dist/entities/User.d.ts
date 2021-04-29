import { BaseEntity } from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";
export declare class User extends BaseEntity {
    id: number;
    username: string;
    email: string;
    password: string;
    updoots: Updoot[];
    posts: Post[];
    createdAt: Date;
    updatedAt: Date;
}
