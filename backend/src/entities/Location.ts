import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Ad from "./Ad";

@Entity()
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
    ad => ad.user
  )
  ads: Ad[];
}
