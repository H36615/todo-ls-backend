
import healthRoute from "./routes/health/health";
import todoItemRoute from "./routes/todo-item/todo-item";
import userRoute from "./routes/user/user";
import { Router } from "express";
import { AuthUtils } from "../utils/auth/auth";

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
	"/auth",
	AuthUtils.sessionIsAuthenticated,
	[
		todoItemRoute
	],
);

export {
	publicApiRouter as publicApi,
	authenticatedApiRouter as authenticatedApi
};