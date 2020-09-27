

import express from "express";
import { authenticatedApi, publicApi } from "./api/index";

const port = 3000;
const app = express();

console.log("starting server...");

app.use("/", publicApi);
app.use("/auth", authenticatedApi);

app.listen(port, () => {
	console.log("running on port " + port);
});
