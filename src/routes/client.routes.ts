import express from "express";
import { handleClientRoute } from "../controllers/client.controller";
import validateSession from "../middleware/validateSession";

const clientRouter = express.Router();

clientRouter.all("/*", validateSession, handleClientRoute);

export default clientRouter;
