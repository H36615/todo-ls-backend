import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

export class EnvironmentUtils {

	public static getValidatedEnvironment(): Environment {
		if (process.env.ENVIRONMENT === Environment.development)
			return Environment.development;
		else if (process.env.ENVIRONMENT === Environment.production)
			return Environment.production;
		throw new Error("incorrect environment .env value set");
	}

	public static getValidatedSessionSecret(): string {
		if (process.env.SESSION_SECRET != undefined && process.env.SESSION_SECRET != "")
			return process.env.SESSION_SECRET;

		throw new Error("session secret .env value is undefined");
	}
}

export enum Environment {
	development = "development",
	production = "production",
}