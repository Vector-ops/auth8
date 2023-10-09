import bodyParser from "body-parser";

import dotenv from "dotenv";
import express, { Express } from "express";
import authRouter from "./routes/auth.routes";
dotenv.config();

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import expressSession from "express-session";
import prisma from "./db/prisma";
import { errorHandler } from "./middleware/allRouteCatch";
import clientRouter from "./routes/client.routes";

const app: Express = express();
const PORT = 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	expressSession({
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
		},
		secret: "a santa at nasa",
		resave: true,
		saveUninitialized: true,
		// @ts-ignore
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000, // 2 mins
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	})
);

app.use("/auth", authRouter);
app.use("/api", clientRouter);
app.use(errorHandler);
app.listen(PORT, () => {
	console.log("Connected to server on port: ", PORT);
});
