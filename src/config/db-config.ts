

import knex, { Config } from "knex";
import knexFile from "../../knexfile";
import { Environment, EnvironmentUtils } from "../utils/environment/environment";

const environment = EnvironmentUtils.getValidatedEnvironment();

let configOptions: Config;
if (environment === Environment.development)
	configOptions = knexFile[environment] as Config;
else {
	throw new Error("implementation missing for environment value");
}

export const dBConfig = knex(configOptions);
