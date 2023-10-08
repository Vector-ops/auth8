import RedisStore from "connect-redis";
import session, { SessionOptions, Store } from "express-session";
import { createClient } from "redis";

let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore: Store = new RedisStore({
	client: redisClient,
	prefix: "myapp:",
	disableTouch: true,
});

const sessionOptions: SessionOptions = {
	name: "qid",
	store: redisStore,
	resave: false,
	saveUninitialized: false,
	secret: "sdijsdnniggaballsfdindfses",
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "none", // csrf protection
	},
};

export const redisSession = session(sessionOptions);
