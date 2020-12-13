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

	public static getValidatedCorsOrigin(): string {
		if (process.env.CORS_ORIGIN != undefined
			&& process.env.CORS_ORIGIN != "")
			return process.env.CORS_ORIGIN;

		throw new Error(
			"Wrong value in env.CORS_ORIGIN, which was: "
			+ process.env.CORS_ORIGIN
		);
	}

	public static getValidatedServerPort(): number {
		if (process.env.SERVER_PORT != undefined
			&& process.env.SERVER_PORT != ""
			&& !isNaN(+process.env.SERVER_PORT))
			return +process.env.SERVER_PORT;

		throw new Error(
			"Wrong value in env.SERVER_PORT, which was: "
			+ process.env.SERVER_PORT
		);
	}
}

export enum Environment {
	development = "development",
	production = "production",
}