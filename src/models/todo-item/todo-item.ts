
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
		id: "id",
		user_id: "user_id",
		task: "task",
		status: "status",
	},
};

/** Validator for new todo items. User id omitted since it's set from session. */
const newTodoItemValidator = Joi.object(
	{
		task: Joi.string().min(1).max(100).required(),
		status: Joi.string().valid(...Object.values(TodoItemStatus)).required(),
	}
);

export {
	ITodoItem,
	INewTodoItem,
	TodoItemStatus,
	todoItemDBModel,
	newTodoItemValidator,
};