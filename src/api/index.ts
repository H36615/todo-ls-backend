
import testRoute from "./routes/test";
import { Router } from "express"

const publicApiRouter = Router();

publicApiRouter.use("/", testRoute);

export { publicApiRouter as publicApi };