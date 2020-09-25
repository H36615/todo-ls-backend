

import knex from "knex";
import knexFile from "../knexfile";

const enviroment = "development"; // TODO || .envify process.env
const configOptions = knexFile[enviroment];

export default knex(configOptions);
