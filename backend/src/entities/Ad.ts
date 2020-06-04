import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";
import Activity from "./Activity";
import Location from "./Location";
import AdResponse from "./AdResponse";

@Entity()
@ObjectType()
export default class Ad extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => ID)
  @ManyToOne(
    type => User,
    user => user.ads
  )
  user: User;

  @Field(() => ID)
  @ManyToOne(
    type => Activity,
    activity => activity.ads
  )
  activity: Activity;

  @Field(() => ID)
  @ManyToOne(
    type => Location,
    location => location.ads
  )
  location: Location;

  @Field(() => ID)
  @OneToMany(
    type => AdResponse,
    response => response.ad
  )
  responses: AdResponse[];
}
