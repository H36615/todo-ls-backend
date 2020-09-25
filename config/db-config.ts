

import knex, { Config } from "knex";
import knexFile from "../knexfile";

const enviroment = "development"; // TODO || .envify process.env
const configOptions: Config = knexFile[enviroment] as Config;

export default knex(configOptions);
