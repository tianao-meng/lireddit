
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";

// ObjectType convert class to graphQl type and to use it in resolvers
@ObjectType()
//decorator mikroOrm this is entitiy, a database table
@Entity()
export class User extends BaseEntity{

  // field expose to our graphQl schema
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  //decorator database column, if remove just a field of a class;
  @Column({unique: true})
  username!: string;

  @Field()
  //decorator database column, if remove just a field of a class;
  @Column({unique: true})
  email!: string;
  
  //decorator database column, if remove just a field of a class;
  @Column()
  password!: string;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}