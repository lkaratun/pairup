import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
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
}
