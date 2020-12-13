

import express from "express";
import { authenticatedApi, publicApi } from "./api/index";
import expressSession from "express-session";
import { passportConfig } from "./config/passport-config";
import { Environment, EnvironmentUtils } from "./utils/environment/environment";
import cors from "cors";

const port = EnvironmentUtils.getValidatedServerPort();
const app = express();

// -- NOTE: Order matters.
// Cors to allow selected development origin when in development environment.
if (EnvironmentUtils.getValidatedEnvironment() === Environment.development)
	app.use(cors({ origin: EnvironmentUtils.getValidatedDevelopmentEnabledCorsOrigin(), }));
app.use(express.json());
app.use(expressSession({
	secret: EnvironmentUtils.getValidatedSessionSecret(),
	resave: false,
	saveUninitialized: true,
	cookie: {
		// With 'true' cookie is sent only in https (not http).
		secure: EnvironmentUtils.getValidatedEnvironment() === Environment.production
			? true
			: "auto",
		maxAge: 1000 * 60 * 60 * 24 * 1 // value in milliseconds
	},
}));
app.use(passportConfig.initialize());
app.use(passportConfig.session());
app.use("/api",
	[
		publicApi,
		authenticatedApi
	]
);

app.listen(port, () => {
	console.log("running on port " + port);
});
