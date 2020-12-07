import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

export class EnvironmentUtils {

	public static getValidatedEnvironment(): Environment {
		if (process.env.ENVIRONMENT === Environment.development)
			return Environment.development;
		else if (process.env.ENVIRONMENT === Environment.production)
			return Environment.production;
		throw new Error(
			"Wrong value in env.ENVIRONMENT, which was: " + process.env.ENVIRONMENT
		);
	}

	public static getValidatedSessionSecret(): string {
		if (process.env.SESSION_SECRET != undefined && process.env.SESSION_SECRET != "")
			return process.env.SESSION_SECRET;

		throw new Error(
			"Wrong value in env.SESSION_SECRET, which was: " + process.env.SESSION_SECRET
		);
	}

	public static getValidatedDevelopmentEnabledCorsOrigin(): string {
		if (process.env.DEVELOPMENT_ENABLED_CORS_ORIGIN != undefined
			&& process.env.DEVELOPMENT_ENABLED_CORS_ORIGIN != "")
			return process.env.DEVELOPMENT_ENABLED_CORS_ORIGIN;

		throw new Error(
			"Wrong value in env.DEVELOPMENT_ENABLED_CORS_ORIGIN, which was: "
			+ process.env.DEVELOPMENT_ENABLED_CORS_ORIGIN
		);
	}
}

export enum Environment {
	development = "development",
	production = "production",
}