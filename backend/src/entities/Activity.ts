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
export default class Activity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => ID)
  @OneToMany(
    type => Ad,
    ad => ad.user
  )
  ads: Ad[];
}
