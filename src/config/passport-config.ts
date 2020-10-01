
import passportConfig from "passport";
import { ExtractJwt, Strategy as JWTStrategy, VerifiedCallback } from "passport-jwt";

interface ILoginPayload {
    user: string,
    userPassword: string,
}

// TODO .envify!
const secret = "";
const authorizationHeaderName = "";
const passportStrategies = {
	user: "user",
};

passportConfig.use(
	passportStrategies.user,
	new JWTStrategy(
		{
			secretOrKey: secret,
			jwtFromRequest: ExtractJwt.fromHeader(authorizationHeaderName),
		},
		(payload: ILoginPayload, done: VerifiedCallback) => {

			// We need to check that payload comes with all interface-defined property values.
			if (!valueExistsForEveryInterfaceProperty<ILoginPayload>(payload))
				return createError(done, "one or more property value missing");

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
    
	return true;
}

function createError(done: VerifiedCallback, errorMessage: string) {
	return done(errorMessage, false);
}

// TODO remove eslint-disabler after implementation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function valueExistsForEveryInterfaceProperty<TInterface>(object: TInterface): boolean {
	// TODO implement.
	// TOOD test.
    
	return true;
}

export { passportConfig, passportStrategies };
