
import Joi from "joi";
import { IDatabaseModel } from "../interfaces";

/** String values represent db enum values. */
enum TodoItemStatus {
    todo = "todo",
    inProgres = "in_progress",
    done = "done",
    delayed = "delayed",
}

interface INewTodoItem {
	user_id: number,
    task: string,
    status: TodoItemStatus,
}
interface ITodoItem extends INewTodoItem {
	id: number,
}

const todoItemDBModel: IDatabaseModel<ITodoItem> = {
	table: "todo_item",
	columns: {
		user_id: "user_id",
		id: "id",
		task: "task",
		status: "status",
	},
};

const taskValidator = Joi.string().min(1).max(100).required();
const statusValidator = Joi.string().valid(...Object.values(TodoItemStatus)).required();
/** Validator for new todo items. User id omitted since it's set from session. */
const newTodoItemValidator = Joi.object(
	{
		task: taskValidator,
		status: statusValidator,
	}
);
const todoItemValidator = Joi.object(
	{
		user_id: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).required(),
		id: Joi.number().min(0).max(Number.MAX_SAFE_INTEGER).required(),
		task: taskValidator,
		status: statusValidator,
	}
);

export {
	ITodoItem,
	INewTodoItem,
	TodoItemStatus,
	todoItemDBModel,
	newTodoItemValidator,
	todoItemValidator,
};