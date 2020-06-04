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
export default class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  image: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  googleAccessToken: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  googleRefreshToken: string;

  @Field(() => ID)
  @OneToMany(
    type => Ad,
    ad => ad.user
  )
  ads: Ad[];

  @Field(() => ID)
  @OneToMany(
    type => Ad,
    ad => ad.user
  )
  adResponses: Ad[];
}
