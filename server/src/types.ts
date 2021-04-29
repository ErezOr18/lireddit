import { Request, Response } from "express";
import { SessionData, Session } from "express-session";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
export type MyContext = {
  req: Request & { session: Session & Partial<SessionData> }; //& { session: Request.Session };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};
