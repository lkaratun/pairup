import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
  Column
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Ad from "./Ad";
import User from "./User";

@Entity()
@Unique(["user", "ad"])
@ObjectType()
export default class AdResponse extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(
    type => User,
    user => user.adResponses
  )
  user: User;

  @Field(() => Ad, { nullable: true })
  @ManyToOne(
    type => Ad,
    ad => ad.responses
  )
  ad: Ad;

  // @Column({ nullable: true })
  // adId: string;
}
