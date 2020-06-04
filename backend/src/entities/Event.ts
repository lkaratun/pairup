import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class Event extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String)
  @Column()
  authorId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  image: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  activityId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  locationId: string;

  @Field(() => String, { nullable: true })
  @Column("timestamp", { nullable: true })
  dateFrom: string;

  @Field(() => String, { nullable: true })
  @Column("timestamp", { nullable: true })
  dateTo: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  minPeople: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  maxPeople: number;
}
