import express from "express";
import {
	authLogin,
	authLogout,
	authRegister,
	getUser,
} from "../controllers/auth.controllers";

import validateSession from "../middleware/validateSession";

const authRouter = express.Router();

authRouter.post("/register", authRegister);
authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.post("/user/:userId", validateSession, getUser);

export default authRouter;
