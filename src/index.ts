

import express from "express";
import { authenticatedApi, publicApi } from "./api/index";
import expressSession from "express-session";
import { passportConfig } from "./config/passport-config";
import { Environment, EnvironmentUtils } from "./utils/environment/environment";

const port = 3000;
const app = express();

// NOTE: Order matters.
app.use(express.json());
app.use(expressSession({
	secret: EnvironmentUtils.getValidatedSessionSecret(),
	resave: false,
	saveUninitialized: true,
	cookie: {
		// With 'true' cookie is sent only in https (not http).
		secure: EnvironmentUtils.getValidatedEnvironment() === Environment.production,
		maxAge: 1000 * 60 * 60 * 24 * 1 // value in milliseconds
	},
}));
app.use(passportConfig.initialize());
app.use(passportConfig.session());
app.use("/api/",
	[
		publicApi,
		authenticatedApi
	]
);

app.listen(port, () => {
	console.log("running on port " + port);
});
