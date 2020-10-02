import { IDatabaseModel } from "../interfaces";

/** String values represent db enum values. */
enum TodoItemStatus {
    todo = "todo",
    inProgres = "in_progress",
    done = "done",
    delayed = "delayed",
}

interface ITodoItem {
	id: number,
	userId: number,
    task: string,
    status: TodoItemStatus,
}

const todoItemDBModel: IDatabaseModel<ITodoItem> = {
	table: "todo_item",
	columns: {
		id: "id",
		userId: "user_id",
		task: "task",
		status: "status",
	},
};

export {
	ITodoItem,
	TodoItemStatus,
	todoItemDBModel
};