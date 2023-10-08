import argon2 from "argon2";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/prisma";
import authSchema from "../utils/validation";

declare module "express-session" {
	export interface SessionData {
		userId: string;
	}
}

export const authRegister: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = await authSchema.validateAsync(req.body);
		const userExists = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (userExists) {
			return next(createHttpError.Conflict("User already exists."));
		}
		const hashedPassword = await argon2.hash(password);

		const user = await prisma.user.create({
			data: {
				email: email,
				password: hashedPassword,
			},
		});
		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		if (error.isJoi === true)
			return next(
				createHttpError.BadRequest("Invalid username/password")
			);
		next(error);
	}
};

export const authLogin: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = await authSchema.validateAsync(req.body);
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!user) {
			return next(createHttpError.NotFound("User does not exist."));
		}
		const validPassword = await argon2.verify(user!.password, password);

		if (validPassword) {
			req.session.userId = user!.id;
			res.status(200).json({
				id: user.id,
				email: user?.email,
				message: "Authenticated",
			});
		} else {
			return next(createHttpError.Unauthorized("Invalid credentials."));
		}
	} catch (error) {
		if (error.isJoi === true)
			return next(
				createHttpError.BadRequest("Invalid username/password")
			);
		return next(createHttpError.Unauthorized("Invalid credentials."));
	}
};

export const authLogout: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	req.session.destroy((err: any) => {
		if (err) {
			return next(
				createHttpError.InternalServerError(
					"Something went wrong. Retry again later."
				)
			);
		} else {
			res.status(200).json({ message: "Session destroyed." });
		}
	});
};

export const getUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			return next(createHttpError.NotFound("User not found."));
		}
		const data = {
			id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
		};
		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		return next(
			createHttpError.InternalServerError(
				"Something went wrong. Retry again later"
			)
		);
	}
};
