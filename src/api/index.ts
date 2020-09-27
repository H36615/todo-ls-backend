
import testRoute from "./routes/test";
import todoItemRoute from "./routes/todo-item";
import { Router } from "express";

const publicApiRouter = Router();
// TODO make this actually authenticated.
const authenticatedApiRouter = Router();

publicApiRouter.use("/", testRoute);

export { publicApiRouter as publicApi, authenticatedApiRouter as authenticatedApi };