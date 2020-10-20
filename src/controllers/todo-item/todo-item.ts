import { dBConfig } from "../../config/db-config";
import { logError } from "../../logger/logger";
import {
	ITodoItem, ITodoItem_IdLess, todoItemDBModel, todoItemValidator
} from "../../models/todo-item/todo-item";
import { getResponseValue, IController, ResponseType } from "../interfaces";

export const getAllTodoItems: IController = (req, res, next): Promise<void> => {
	return dBConfig(todoItemDBModel.table).select("*").then((rows: ITodoItem[]) => {
		res.send(rows);
	}).catch(err => {
		logError(err);
		next(err);
	});
};

export const addTodoItem: IController = (req, res, next): Promise<void> => {

	// Validate param
	return todoItemValidator.validateAsync(req.body).then(

		// Add item
		(validatedValue: ITodoItem_IdLess) => dBConfig(todoItemDBModel.table)
			.insert(validatedValue)
			.then(() => {
				res.send(getResponseValue(ResponseType.OK));
			})
	).catch(error => {
		logError(error);
		next(error);
	});
};