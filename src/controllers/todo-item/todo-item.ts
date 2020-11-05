import { dBConfig } from "../../config/db-config";
import { Logger } from "../../utils/logger/logger";
import {
	ITodoItem, INewTodoItem, todoItemDBModel, newTodoItemValidator
} from "../../models/todo-item/todo-item";
import { getResponseValue, IController, ResponseType } from "../interfaces";
import { UserUtils } from "../../utils/user/user";

export const getAllTodoItems: IController = (req, res, next): Promise<void> => {
	return dBConfig(todoItemDBModel.table).select("*").then((rows: ITodoItem[]) => {
		res.send(rows);
	}).catch(err => {
		Logger.error(err);
		next(err);
	});
};

export const addTodoItem: IController = (req, res, next): Promise<void> => {
	let userId: number;

	return UserUtils.getUserIdFromSession(req).then((_userId: number) => {
		userId = _userId;

		// Validate param
		return newTodoItemValidator.validateAsync(req.body);
	})
		.then((validatedValue: Omit<INewTodoItem, "user_id">) => {

			const todoItem: INewTodoItem = {
				...validatedValue,
				user_id: userId
			};

			// Add item
			return dBConfig(todoItemDBModel.table)
				.insert(todoItem);
		})
		.then(() => {
			res.send(getResponseValue(ResponseType.OK));
		})
		.catch(error => {
			Logger.error(error);
			next(error);
		});
};