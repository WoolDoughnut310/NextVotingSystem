import nextSession from "next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";
import RedisStoreFactory from "connect-redis";
import Redis from "ioredis";

const RedisStore = RedisStoreFactory(expressSession);
export const getSession = nextSession({
    autoCommit: false,
    store: promisifyStore(
        new RedisStore({
            client: new Redis({
                host: process.env.REDIS_HOST as string,
                port: parseInt(process.env.REDIS_PORT as string),
                password: process.env.REDIS_PASSWORD as string,
            }),
        })
    ),
});
