import { IDatabaseModel } from "../interfaces";

/** String values represent db enum values. */
enum TodoItemStatus {
    todo = "todo",
    inProgres = "in-progress",
    done = "done",
    delayed = "delayed",
}

interface ITodoItem {
    task: string,
    status: TodoItemStatus,
}

const todoItemDBModel: IDatabaseModel<ITodoItem> = {
	table: "todo_item",
	columns: {
		task: "task",
		status: "status",
	},
};

export {
	ITodoItem,
	TodoItemStatus,
	todoItemDBModel
};