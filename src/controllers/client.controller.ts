import { NextFunction, Request, RequestHandler, Response } from "express";

export const handleClientRoute: RequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(200).redirect(`http://localhost:3000${req.path}`);
};
