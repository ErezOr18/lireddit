import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Updoot } from "./Updoot";
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  title!: string;
  @Field(() => String)
  @Column()
  text!: string;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;
  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date = new Date();
  @Field(() => Number)
  @Column()
  creatorId!: number;
  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator!: User;

  @OneToMany(() => Updoot, (updoot) => updoot.postId)
  updoots!: Updoot[];
}
