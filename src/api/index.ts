
import healthRoute from "./routes/health/health";
import todoItemRoute from "./routes/todo-item/todo-item";
import userRoute from "./routes/user/user";
import { Router } from "express";
import { passportConfig, passportStrategies } from "../config/passport-config";

const publicApiRouter = Router();
const authenticatedApiRouter = Router();

publicApiRouter.use(
	"/",
	healthRoute,
	userRoute,
);
authenticatedApiRouter.use(
	"/",
	// TODO Do we want to use 'session'?
	passportConfig.authenticate(passportStrategies.user, { session: false }),
	todoItemRoute,
);

export {
	publicApiRouter as publicApi,
	authenticatedApiRouter as authenticatedApi
};