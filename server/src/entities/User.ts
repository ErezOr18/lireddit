import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
  @OneToMany(() => Updoot, (updoot) => updoot.userId)
  updoots!: Updoot[];
  @OneToMany(() => Post, (post) => post.creator)
  posts!: Post[];
  @Field(() => String)
  @UpdateDateColumn()
  createdAt: Date = new Date();

  @Field(() => String)
  @CreateDateColumn()
  updatedAt: Date = new Date();
}
