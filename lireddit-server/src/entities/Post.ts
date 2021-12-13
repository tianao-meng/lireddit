
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Updoot } from "./Updoot";
import { User } from "./User";

// ObjectType convert class to graphQl type and to use it in resolvers
@ObjectType()
//decorator mikroOrm this is entitiy, a database table
@Entity()
export class Post extends BaseEntity{

  // field expose to our graphQl schema
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;


  @Field()
  //decorator database column, if remove just a field of a class;
  @Column()
  title!: string;

  @Field()
  //decorator database column, if remove just a field of a class;
  @Column()
  text!: string;

  @Field()
  //decorator database column, if remove just a field of a class;
  @Column({type: "int", default:0})
  points!: number;
  
  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @OneToMany(() => Updoot, updoot=> updoot.post)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}