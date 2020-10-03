import dbConfig from "../../config/db-config";
import { todoItemDBModel } from "../../models/todo-item/todo-item";
import { IController } from "../interfaces";

export const getAllTodoItems: IController = (req, res): void => {
	dbConfig(todoItemDBModel.table).select("*").then(rows => {
		res.send(rows);
	});
};