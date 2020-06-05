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
@Unique(["respondent", "ad"])
@ObjectType()
export default class AdResponse extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @ManyToOne(
    type => User,
    user => user.adResponses
  )
  respondent: User;

  @Field(() => String)
  @ManyToOne(
    type => Ad,
    ad => ad.responses
  )
  ad: Ad;
}
