

import express from "express";
import { authenticatedApi, publicApi } from "./api/index";
import expressSession from "express-session";
import { passportConfig } from "./config/passport-config";
import { Environment, EnvironmentUtils } from "./utils/environment/environment";
import cors from "cors";

const port = EnvironmentUtils.getValidatedServerPort();
const app = express();

// -- NOTE: Order matters.

// NOTE: To use credential parameters in api calls from browsers, the exact
// urls as cors origins (not * wildcard) must be defined. See link below.
// eslint-disable-next-line max-len
// https://stackoverflow.com/questions/19743396/cors-cannot-use-wildcard-in-access-control-allow-origin-when-credentials-flag-i#comment97905405_19744754
const corsOrigins = [EnvironmentUtils.getValidatedCorsOrigin()];
if (EnvironmentUtils.getValidatedEnvironment() === Environment.development)
	corsOrigins.push("http://localhost:3000");
app.use(
	cors({
		origin: corsOrigins,
		credentials: true,
	})
);
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
		maxAge: 1000 * 60 * 60 * 24 * 1, // value in milliseconds
		// Some browsers will make this "lax" automatically if none included,
		// and e.g. chrome would not work, so debugging can become difficult
		// when client is localhost & backend is in https. Postman should still work.
		sameSite: EnvironmentUtils.getValidatedEnvironment() === Environment.production
			? "strict"
			: "none"
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
