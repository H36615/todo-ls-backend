
import passportConfig from "passport";
import { ExtractJwt, Strategy as JWTStrategy, VerifiedCallback } from "passport-jwt";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

interface ILoginPayload {
	user: string,
	userPassword: string,
}

const secret = process.env.JWT_SECRET;
const authorizationHeaderName: string = process.env.AUTHORIZATION_HEADER_NAME || "";
const passportStrategies: { [key: string]: string; } = {
	user: "user",
};

checkEnviromentVariables();

passportConfig.use(
	passportStrategies.user,
	new JWTStrategy(
		{
			secretOrKey: secret,
			jwtFromRequest: ExtractJwt.fromHeader(authorizationHeaderName),
		},
		(payload: ILoginPayload, done: VerifiedCallback) => {

			if (userIsAuthorized(payload))
				return done(null, true);

			return createError(done, "other error");
		}
	)
);

// TODO remove eslint-disabler after implementation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function userIsAuthorized(loginPayload: ILoginPayload): boolean {
	// TODO implement.
	// TODO test.

	if (loginPayload.user && loginPayload.userPassword) {
		return true;
	}

	return false;
}

function createError(done: VerifiedCallback, errorMessage: string) {
	return done(errorMessage, false);
}

/** Check that env variables hold values */
function checkEnviromentVariables() {
	if (secret == undefined || authorizationHeaderName == undefined)
		throw new Error("secret enviroment variable missing");

	if (authorizationHeaderName == "")
		throw new Error("authorization header enviroment variable missing");
}

export { passportConfig, passportStrategies };
