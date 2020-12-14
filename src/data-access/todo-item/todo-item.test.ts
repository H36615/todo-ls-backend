import { mockDBConfig } from "../../../testing/db-mocks";
import { dBConfig } from "../../config/db-config";
import {
	INewTodoItem, ITodoItem, todoItemDBModel, TodoItemStatus
} from "../../models/todo-item/todo-item";
import { TodoItemDA } from "./todo-item";

jest.mock("../../config/db-config");

describe("TodoItemDA", () => {
	describe("getAllMapped", () => {
		test("should resolve properly", (done) => {
			// -- Arrange
			const fakeResults: ITodoItem[] = [
				{
					id: 10,
					status: TodoItemStatus.inProgres,
					task: "do a thing",
					user_id: 20,
				},
				{
					id: 11,
					status: TodoItemStatus.delayed,
					task: "make that",
					user_id: 21,
				}
			];
			const filteredfakeResults = fakeResults.map(
				(row: ITodoItem) => {
					const mapItem: Omit<ITodoItem, "user_id"> = {
						task: row.task,
						status: row.status,
						id: row.id,
					};
					return mapItem;
				}
			);
			const fakeUserId = 123;
			mockDBConfig(dBConfig, fakeResults);

			// -- Act
			TodoItemDA.getAllMapped(fakeUserId)

				// -- Assert
				.then((results: Pick<INewTodoItem, "task" | "status">[]) => {
					expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
					expect(results).toEqual(filteredfakeResults);
					done();
				});
		});

		test("should catch DB error properly", (done) => {
			// -- Arrange
			const error = new Error("rejecty");
			const fakeUserId = 123;

			mockDBConfig(dBConfig, error);

			// -- Act
			TodoItemDA.getAllMapped(fakeUserId)

				// -- Assert
				.then(() => {
					done.fail("should have caught error");
				})
				.catch(error => {
					expect(error).toBeDefined();
					// TODO test .where() ?
					expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
					done();
				});
		});
	});

	describe("addNew", () => {
		test("should resolve properly", (done) => {

			// -- Arrange
			const fakeUserId = 123;
			const fakeResult: Pick<INewTodoItem, "task" | "status"> = {
				status: TodoItemStatus.done,
				task: "testytask",
			};
			mockDBConfig(dBConfig, {});			

			// -- Act
			TodoItemDA.addNew({ ...fakeResult, user_id: fakeUserId })

				// -- Assert
				.then(() => {
					expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
					// TODO test .insert call?
					done();
				});
		});

		test("should catch DB error properly", (done) => {
			// -- Arrange
			const error = new Error("fakeError");
			const fakeUserId = 123;
			const fakeResult: Pick<INewTodoItem, "task" | "status"> = {
				status: TodoItemStatus.done,
				task: "testytask",
			};
			mockDBConfig(dBConfig, error);

			// -- Act
			TodoItemDA.addNew({ ...fakeResult, user_id: fakeUserId })

				// -- Assert
				.then(() => {
					done.fail("should have caught error");
				})
				.catch(error => {
					expect(error).toBeDefined();
					expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
					done();
				});
		});
	});
});