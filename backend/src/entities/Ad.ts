import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  Unique
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";
import Activity from "./Activity";
import Location from "./Location";
import AdResponse from "./AdResponse";

@Entity()
@Unique(["user", "activity", "location"])
@ObjectType()
export default class Ad extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  // @Field(() => User)
  @ManyToOne(
    type => User,
    user => user.ads
  )
  user: User;

  @Field(() => Activity)
  @ManyToOne(
    type => Activity,
    activity => activity.ads
  )
  activity: Activity;

  @Field(() => Location, { nullable: true })
  @ManyToOne(
    type => Location,
    location => location.ads
  )
  location: Location;

  @Field(() => [AdResponse], { nullable: true })
  @OneToMany(
    type => AdResponse,
    response => response.ad
    // { cascade: true }
  )
  responses: AdResponse[];
}
