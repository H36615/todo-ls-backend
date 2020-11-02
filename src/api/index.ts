
import healthRoute from "./routes/health/health";
import todoItemRoute from "./routes/todo-item/todo-item";
import userRoute from "./routes/user/user";
import { Router } from "express";
import { UserUtils } from "../utils/user/user";

const publicApiRouter = Router();
const authenticatedApiRouter = Router();

publicApiRouter.use(
	"/",
	[
		healthRoute,
		userRoute,
	]
);
authenticatedApiRouter.use(
	"/",
	UserUtils.sessionIsAuthenticated,
	[
		todoItemRoute
	],
);

export {
	publicApiRouter as publicApi,
	authenticatedApiRouter as authenticatedApi
};