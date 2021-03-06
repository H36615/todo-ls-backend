import { Logger } from "../../utils/logger/logger";
import {
	idValidatorObject,
	INewTodoItem, ITodoItem, newTodoItemValidator, todoItemValidator
} from "../../models/todo-item/todo-item";
import { IController, ResponseType } from "../interfaces";
import { AuthUtils } from "../../utils/auth/auth";
import { TodoItemDA } from "../../data-access/todo-item/todo-item";

export const getAllTodoItems: IController = (req, res, next): Promise<void> => {
	return AuthUtils.getUserIdFromSession(req)
		.then((userId: number) => {
			return TodoItemDA.getAllMapped(userId);
		})
		.then((rows: Omit<ITodoItem, "user_id">[]) => {
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
			res.send(ResponseType.OK);
		})
		.catch(error => {
			Logger.error(error);
			next(error);
		});
};

export const updateTodoItem: IController = (req, res, next): Promise<void> => {
	return AuthUtils.getUserIdFromSession(req)
		.then((userId: number) => {
			// Validate param
			return todoItemValidator.validateAsync({ ...req.body, user_id: userId });
		})
		.then((validatedValue: ITodoItem) => {
			return TodoItemDA.update(validatedValue);
		})
		.then(() => {
			res.json(ResponseType.OK);
		})
		.catch(error => {
			Logger.error(error);
			next(new Error("Updating item failed"));
		});
};

export const deleteTodoItem: IController = (req, res, next): Promise<void> => {
	let userId: number;

	return AuthUtils.getUserIdFromSession(req)
		.then((_userId: number) => {
			userId = _userId;

			// Validate param
			return idValidatorObject.validateAsync(req.body);
		})
		.then((validated: Pick<ITodoItem, "id">) => {
			return TodoItemDA.delete({ ...validated, user_id: userId });
		})
		.then(() => {
			res.json(ResponseType.OK);
		})
		.catch(error => {
			Logger.error(error);
			next("Deleting item failed");
		});
};