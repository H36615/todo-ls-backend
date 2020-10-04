import dbConfig from "../../config/db-config";
import { logError } from "../../logger/logger";
import { ITodoItem, todoItemDBModel } from "../../models/todo-item/todo-item";
import { IController } from "../interfaces";

export const getAllTodoItems: IController = (req, res, next): Promise<void> => {
	return dbConfig(todoItemDBModel.table).select("*").then((rows: ITodoItem[]) => {
		res.send(rows);
	}).catch(err => {
		logError(err);
		next(err);
	});
};