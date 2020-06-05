import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Ad from "./Ad";
import User from "./User";

@Entity()
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

  @Field(() => ID)
  @ManyToOne(
    type => Ad,
    ad => ad.responses
  )
  ad: Ad;
}
