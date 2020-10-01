
import healthRoute from "./routes/health/health";
import todoItemRoute from "./routes/todo-item/todo-item";
import { Router } from "express";
import { passportConfig, passportStrategies } from "../config/passport-config";

const publicApiRouter = Router();
const authenticatedApiRouter = Router();

publicApiRouter.use("/", healthRoute);
authenticatedApiRouter.use(
	"/",
	passportConfig.authenticate(passportStrategies.user, { session: false }), // TODO Do we want to use session?
	todoItemRoute,
);

export { publicApiRouter as publicApi, authenticatedApiRouter as authenticatedApi };