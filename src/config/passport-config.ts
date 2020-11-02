
import passportConfig from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userDBModel } from "../models/user/user";
import { UserUtils } from "../utils/user/user";

const passportStrategies: { [key: string]: string; } = {
	login: "login",
	user: "user",
};

passportConfig.serializeUser((user, done) => {
	done(null, user);
});

/** Login id: e.g. email. */
passportConfig.deserializeUser((loginId, done) => {
	done(null, loginId);
});

passportConfig.use(
	passportStrategies.login,
	new LocalStrategy(
		{
			// DB model is used because it's modelled after its interafce properties.
			usernameField: userDBModel.columns.email,
			passwordField: userDBModel.columns.password,
		},
		(email: string, password: string, done) => {
			UserUtils.isAuthenticatedWithLoginInfo({ email: email, password: password })
				.then((loginId: string) => {
					return done(null, loginId);
					// Next, should set the browser cookie through 'passportConfig.serializeUser'
					// using the argument inside done() (if session is enabled).
					// And then continue the route.
				})
				.catch(error => {
					return createError(done, error);
				});
		}
	)
);

// Passport did not provide type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createError(done: any, errorMessage: string) {
	return done(errorMessage, false);
}

export { passportConfig, passportStrategies };
