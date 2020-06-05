import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Unique
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Ad from "./Ad";

@Entity()
@Unique(["country", "city"])
@ObjectType()
export default class Location extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => String)
  @Column()
  city: string;

  @Field(() => ID)
  @OneToMany(
    type => Ad,
    ad => ad.location
  )
  ads: Ad[];
}
