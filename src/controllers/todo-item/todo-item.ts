import { Logger } from "../../utils/logger/logger";
import {
	INewTodoItem, newTodoItemValidator
} from "../../models/todo-item/todo-item";
import { getResponseValue, IController, ResponseType } from "../interfaces";
import { AuthUtils } from "../../utils/user/user";
import { TodoItemDA } from "../../data-access/todo-item/todo-item";

export const getAllTodoItems: IController = (req, res, next): Promise<void> => {
	return AuthUtils.getUserIdFromSession(req)
		.then((userId: number) => {
			return TodoItemDA.getAllMapped(userId);
		})
		.then((rows: Pick<INewTodoItem, "task" | "status">[]) => {
			res.send(rows);
		})
		.catch(err => {
			Logger.error(err);
			next(err);
		});
};

export const addTodoItem: IController = (req, res, next): Promise<void> => {
	let userId: number;

	return AuthUtils.getUserIdFromSession(req)
		.then((_userId: number) => {
			userId = _userId;

			// Validate param
			return newTodoItemValidator.validateAsync(req.body);
		})
		.then((validatedValue: Omit<INewTodoItem, "user_id">) => {
			return TodoItemDA.addNew({ ...validatedValue, user_id: userId });
		})
		.then(() => {
			res.send(getResponseValue(ResponseType.OK));
		})
		.catch(error => {
			Logger.error(error);
			next(error);
		});
};