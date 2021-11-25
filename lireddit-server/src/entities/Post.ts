import "reflect-metadata"
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

// ObjectType convert class to graphQl type and to use it in resolvers
@ObjectType()
//decorator mikroOrm this is entitiy, a database table
@Entity()
export class Post {

  // field expose to our graphQl schema
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type:'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type:'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  //decorator database column, if remove just a field of a class;
  @Property({type:'text'})
  title!: string;
}