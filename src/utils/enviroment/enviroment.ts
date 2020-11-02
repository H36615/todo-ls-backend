import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

export class EnviromentUtils {

	public static getValidatedEnviroment(): Enviroment {
		if (process.env.ENVIROMENT === Enviroment.development)
			return Enviroment.development;
		else if (process.env.ENVIROMENT === Enviroment.production)
			return Enviroment.production;
		else
			throw new Error("incorrect enviroment .env value set");
	}

	public static getValidatedSessionSecret(): string {
		if (process.env.SESSION_SECRET != undefined)
			return process.env.SESSION_SECRET;

		throw new Error("session secret .env value is undefined");
	}
}

export enum Enviroment {
	development = "development",
	production = "production",
}