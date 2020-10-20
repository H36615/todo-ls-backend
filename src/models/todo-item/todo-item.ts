import { number, object, string } from "joi";
import { IDatabaseModel } from "../interfaces";

/** String values represent db enum values. */
enum TodoItemStatus {
    todo = "todo",
    inProgres = "in_progress",
    done = "done",
    delayed = "delayed",
}

interface ITodoItem_IdLess {
	user_id: number,
    task: string,
    status: TodoItemStatus,
}
interface ITodoItem extends ITodoItem_IdLess {
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

const todoItemValidator = object(
	{
		user_id: number().min(1).required(),
		task: string().min(1).max(100).required(),
		status: string().valid(...Object.values(TodoItemStatus)),
	}
);

export {
	ITodoItem,
	ITodoItem_IdLess,
	TodoItemStatus,
	todoItemDBModel,
	todoItemValidator,
};