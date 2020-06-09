import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Ad from "./Ad";
import User from "./User";

@Entity()
@Unique(["user", "ad"])
@ObjectType()
export default class AdResponse extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User)
  @ManyToOne(
    type => User,
    user => user.adResponses
  )
  user: User;

  @Field(() => Ad)
  @ManyToOne(
    type => Ad,
    ad => ad.responses
  )
  ad: Ad;
}
