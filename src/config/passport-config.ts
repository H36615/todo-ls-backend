
import passportConfig from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { IExistingUser, userDBModel } from "../models/user/user";
import { Logger } from "../utils/logger/logger";
import { UserUtils } from "../utils/user/user";

const passportStrategies: { [key: string]: string; } = {
	login: "login",
};

passportConfig.serializeUser((userId, done) => {
	done(null, userId);
});

/** Deserialize info from cookie, and set user info to 'req' */
passportConfig.deserializeUser((userId, done) => {
	// Cast to number, it's validated anywy.
	UserUtils.getUserFromDBByUserId(userId as number)
		.then((user: IExistingUser) => {
			done(null, user);
		})
		.catch(error => {
			Logger.error(error);
			Promise.reject(error);
		});
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
				.then((userId: number) => {
					return done(null, userId);
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
