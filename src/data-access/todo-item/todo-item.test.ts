import { mockDBConfig } from "../../../testing/db-mocks";
import { dBConfig } from "../../config/db-config";
import {
	INewTodoItem, ITodoItem, todoItemDBModel, TodoItemStatus
} from "../../models/todo-item/todo-item";
import { TodoItemDA } from "./todo-item";
import knex from "knex";

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

	describe("update", () => {

		function updateStub(response: number | Error) {
			return ({
				update: () =>
					(response instanceof Error)
						? Promise.reject(response)
						: Promise.resolve(response)
			});
		}

		function _mockDBConfig(
			dBConfig: knex,
			response: number | Error
		): void {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(dBConfig as any).mockImplementation(() => ({
				where: () => updateStub(response),
				select: () => null,
				insert: () => null,
				update: () => null,
			}));
		}

		test("should resolve properly", (done) => {

			// -- Arrange
			const fakeItem: ITodoItem = {
				id: 1,
				user_id: 11,
				status: TodoItemStatus.done,
				task: "testytask",
			};
			const updatedRows = 1;
			_mockDBConfig(dBConfig, updatedRows);

			// -- Act
			TodoItemDA.update(fakeItem)
				// -- Assert
				.then(() => {
					expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
					done();
				});
		});

		test("should throw error on 0 updated rows", (done) => {

			// -- Arrange
			const fakeItem: ITodoItem = {
				id: 1,
				user_id: 11,
				status: TodoItemStatus.done,
				task: "testytask",
			};
			const updatedRows = 0;
			_mockDBConfig(dBConfig, updatedRows);

			// -- Act
			TodoItemDA.update(fakeItem)
				// -- Assert
				.then(() => {
					done.fail("should have caught error");
				})
				.catch(error => {
					expect(error).toEqual("Updated 0 rows");
					expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
					done();
				});
		});

		test("should catch data access error properly", (done) => {
			// -- Arrange
			const error = new Error("DA errory");
			const fakeItem: ITodoItem = {
				id: 1,
				user_id: 11,
				status: TodoItemStatus.done,
				task: "testytask",
			};
			_mockDBConfig(dBConfig, error);

			// -- Act
			TodoItemDA.update(fakeItem)
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