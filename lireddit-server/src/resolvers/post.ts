
import { Post } from "../entities/Post";
import { Arg,  Ctx,  Field,  FieldResolver,  InputType,  Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";



@InputType()
class PostInput {
    @Field()
    title: string;
    
    @Field()
    text: string;
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];

    @Field()
    hasMore: boolean;
}


@Resolver(Post)
export class PostResolver {

    @FieldResolver(() => String)
    textSnippet(@Root() root: Post){
        return root.text.slice(0, 50);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId') postId: number,
        @Arg('value') value: number, 
        @Ctx() {req}: MyContext
    ){


        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const userId = req.session.userId;

        const updoot = await Updoot.findOne({where: {postId, userId}});

        // has updooted and voted a different value
        if(updoot && updoot.value !== realValue){
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                update updoot
                set value = $1
                where "postId" = $2 and "userId" = $3
                `, [realValue, postId, userId]);
                await tm.query(`
                update post
                set points = points + $1
                where id = $2;
                `, [2 * realValue, postId]);
            }) 
        } else if(!updoot){
            // has never voted before
            await getConnection().transaction(async tm => {
                await tm.query(`
                insert into updoot ("userId", "postId", value)
                values ($1, $2, $3);
                `, [userId, postId, realValue])

                await tm.query(`
                update post
                set points = points + $1
                where id = $2;
                `, [realValue, postId])
            })
        }

        return true;

    }

    //graph ql pass Post type
    @Query(() => PaginatedPosts)
    // typescript type
    // there r some duplication in typegraphQl
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, {nullable: true}) cursor: string | null,
        @Ctx() {req}: MyContext
    ): Promise<PaginatedPosts>{
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = Math.min(50, limit) + 1;
        const replacement:any[] = [realLimitPlusOne];

        if(req.session.userId){
            replacement.push(req.session.userId);
        }

        let cursorInReplace = 3;

        if(cursor){
            replacement.push(new Date(parseInt(cursor)));
            cursorInReplace = replacement.length;
        }
        const posts = await getConnection().query(`
            select p.*, 
            json_build_object(
                'id', u.id,
                'username', u.username,
                'email', u.email,
                'createdAt', u."createdAt",
                'updatedAt', u."updatedAt"
            ) creator,
            ${req.session.userId ? `(select u.value from updoot u where "userId" = $2 and "postId" = p.id) as "voteStatus"` : 'null as "voteStatus"'}
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor? `where p."createdAt" < $${cursorInReplace}`:""}
            order by p."createdAt" DESC
            limit $1
        `,replacement);
 
        // console.log(posts)
        // const qb = getConnection() 
        // .getRepository(Post)
        // .createQueryBuilder("p")
        // .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"') 
        // .orderBy('p."createdAt"',"DESC")
        // .take(realLimitPlusOne)
    
        // if (cursor){
        //     qb.where('p."createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
        // }
        // const posts = await qb.getMany()
        return {posts:posts.slice(0, realLimit) , hasMore:posts.length === realLimitPlusOne};
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id', () => Int) id: number,
    ): Promise<Post | undefined>{
        return Post.findOne(id) 
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    createPost(
        @Arg('input') input: PostInput,
        @Ctx(){req}: MyContext
    ): Promise<Post>{

        return Post.create({
            ...input,
            creatorId: req.session.userId
        }).save()

    }
    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
    ): Promise<Post | null>{
        const post = await Post.findOne(id);
        if(!post){
            return null;
        }
        if(typeof title !== 'undefined'){
            Post.update(id, {title});
        }
        return post

    }
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
    ): Promise<boolean>{
        Post.delete(id)
        return true;

    }
}