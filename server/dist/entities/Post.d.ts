import { BaseEntity } from "typeorm";
import { User } from "./User";
import { Updoot } from "./Updoot";
export declare class Post extends BaseEntity {
    id: number;
    title: string;
    text: string;
    voteStatus: number | null;
    points: number;
    createdAt: Date;
    updatedAt: Date;
    creatorId: number;
    creator: User;
    updoots: Updoot[];
}
