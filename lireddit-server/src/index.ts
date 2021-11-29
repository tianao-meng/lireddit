import {MikroORM} from '@mikro-orm/core';
import { __prod__ , COOKIE_NAME} from './constants';
// import { Post } from './entities/Post';
import microConfig from './mikro-orm.config'
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from 'src/types';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from 'cors';
import { User } from './entities/User';


const main = async () => {
    //console.log(__dirname);
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    const app = express();
    const RedisStore = connectRedis(session)
    const redis = new Redis()

    app.use(cors({
        origin:'http://localhost:3000',
        credentials:true,
    }));

    app.use(
        session({
            name:COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000*60*60*24*365*10,
                httpOnly:true,
                sameSite:'lax', // Cross-site request forgery
                // sameSite:'none', 
                secure: __prod__, // cookie only works in https
            },
            saveUninitialized: false,
            secret: '12345678',
            resave: false,
        })
    )
    const apolloServer = new ApolloServer({
        schema:await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver ],
            validate:false,
        }),
        // context is a special object, that can be accessed by our resolvers
        context:({req, res}): MyContext => ({em: orm.em, req, res, redis}),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
              // options
            }),
          ],
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app, cors:false})
    // apolloServer.applyMiddleware({app});
    app.listen(4000, ()=>{
        console.log("server started on localhost:4000")
    })
}
main().catch((err) => {
    console.error(err);
});
console.log("Hello aorld");


