import { dBConfig } from "../../config/db-config";
import { INewTodoItem, ITodoItem, todoItemDBModel } from "../../models/todo-item/todo-item";

/** Todo item data access. */
export class TodoItemDA {

	/** Get all items by @param & filter out unneeded fields on each item. */
	public static getAllMapped(userId: number): Promise<Omit<ITodoItem, "user_id">[]> {

		const userIdObject: Pick<INewTodoItem, "user_id"> = {
			user_id: userId,
		};

		return dBConfig(todoItemDBModel.table)
			.where(userIdObject)
			.then((rows: ITodoItem[]) => {
				if (rows == undefined || rows.length == undefined)
					throw new Error("rows is undefined");

				// Filter out unneeded fields.
				return rows.map(
					(row: ITodoItem) => {
						const mapItem: Omit<ITodoItem, "user_id"> = {
							task: row.task,
							status: row.status,
							id: row.id,
						};
						return mapItem;
					}
				);
			});
	}

	public static addNew(newItem: INewTodoItem): Promise<void> {

		return dBConfig(todoItemDBModel.table)
			.insert(newItem)
			.then(() => {
				return;
			});
	}
}