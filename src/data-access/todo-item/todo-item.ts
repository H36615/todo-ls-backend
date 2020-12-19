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

	public static addNew(newItem: INewTodoItem): Promise<void | number> {
		return dBConfig(todoItemDBModel.table)
			.insert(newItem)
			.then(() => {
				return;
			});
	}

	public static update(item: ITodoItem): Promise<number | void> {
		if (!item)
			return Promise.reject("item does not exist");

		const whereObject: Pick<ITodoItem, "id" | "user_id">
			= { id: item.id, user_id: item.user_id };

		return dBConfig(todoItemDBModel.table)
			.where(whereObject)
			.update({ task: item.task, status: item.status })
			.then((updatedRows: number) => {
				if (updatedRows > 0)
					return Promise.resolve(updatedRows);

				return Promise.reject("Updated 0 rows");
			});
	}
}