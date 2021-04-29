import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { User } from "../entities/User";
declare class PostInput {
    title: string;
    text: string;
}
declare class PaginatedPost {
    posts: Post[];
    hasMore: boolean;
}
export declare class PostResolver {
    textSnippet(root: Post): string;
    creator(post: Post, { userLoader }: MyContext): Promise<User>;
    voteStatus(post: Post, { updootLoader, req }: MyContext): Promise<number | null>;
    vote(postId: number, value: number, { req }: MyContext): Promise<boolean>;
    posts(limit: number, cursor: string | null): Promise<PaginatedPost>;
    post(id: number): Promise<Post | undefined>;
    createPost(input: PostInput, { req }: MyContext): Promise<Post>;
    updatePost(title: string, text: string, id: number, { req }: MyContext): Promise<Post | null>;
    deletePost(id: number, { req }: MyContext): Promise<boolean>;
}
export {};
