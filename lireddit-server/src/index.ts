import "reflect-metadata"
import 'dotenv-safe/config'
import { __prod__ , COOKIE_NAME} from './constants';

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
import {createConnection} from 'typeorm'
import { User } from './entities/User';
import { Post } from './entities/Post';
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

const main = async () => {
    // console.log('dir: ',__dirname)
    const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging:true,
        // synchronize:true,
        migrations:[path.join(__dirname,"./migrations/*")],
        entities:[Post, User, Updoot]
    });

    // await conn.runMigrations();
    // await Post.delete({});
    const app = express();
    const RedisStore = connectRedis(session)
    const redis = new Redis(process.env.REDIS_URL)
    app.set("trust proxy", 1);
    app.use(cors({
        origin:process.env.CORS_ORIGIN,
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
                domain: __prod__ ? ".tianao.xyz" : undefined,
            },
            saveUninitialized: false,
            secret:process.env.SESSION_SECRET,
            resave: false,
        })
    )
    const apolloServer = new ApolloServer({
        schema:await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver ],
            validate:false,
        }),
        // context is a special object, that can be accessed by our resolvers
        context:({req, res}): MyContext => ({req, res, redis, userLoader: createUserLoader(), updootLoader: createUpdootLoader()}),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
              // options
            }),
          ],
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app, cors:false})
    // apolloServer.applyMiddleware({app});
    app.listen(parseInt(process.env.PORT), ()=>{
        console.log("server started on localhost:4000")
    })
}
main().catch((err) => {
    console.error(err);
});
console.log("Hello aorld");


