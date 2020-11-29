import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

export class EnvironmentUtils {

	public static getValidatedEnvironment(): Environment {
		if (process.env.ENVIRONMENT === Environment.development)
			return Environment.development;
		else if (process.env.ENVIRONMENT === Environment.production)
			return Environment.production;
		throw new Error(
			"Wrong value in env.ENVIRONMENT, which value is: " + process.env.ENVIRONMENT
		);
	}

	public static getValidatedSessionSecret(): string {
		if (process.env.SESSION_SECRET != undefined && process.env.SESSION_SECRET != "")
			return process.env.SESSION_SECRET;

		throw new Error(
			"Wrong value in env.SESSION_SECRET, which value is: " + process.env.SESSION_SECRET
		);
	}
}

export enum Environment {
	development = "development",
	production = "production",
}