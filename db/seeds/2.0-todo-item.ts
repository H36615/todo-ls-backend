import Knex from "knex";
import { todoItemDBModel } from "../../src/models/todo-item/todo-item";

export async function seed(knex: Knex): Promise<void> {
	// -- Delete existing entries

	await knex(todoItemDBModel.table).del();

	// -- Insert seed entries

	// Not really necessary to add this.
	// await TodoItemDA.addNew(
	// 	{
	// 		user_id: <get_public_test_user_id>,
	// 		task: "water the plants",
	// 		status: TodoItemStatus.todo,
	// 	}
	// );
}
