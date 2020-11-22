

import knex, { Config } from "knex";
import knexFile from "../../knexfile";

const environment = "development"; // TODO || .envify process.env
const configOptions: Config = knexFile[environment] as Config;

export const dBConfig = knex(configOptions);
