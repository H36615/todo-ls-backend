import { todoItemDBModel } from "./todo-item";

test("test that columns' key name and value match", () => {
	// Arrange
	const columnNames = Object.keys(todoItemDBModel.columns);
	const columnValues = Object.values(todoItemDBModel.columns);

	// Act + Assert
	for (let i = 0; i < columnNames.length; i++) {
		// We want to make sure db namings match interface properties.
		expect(columnNames[i]).toEqual(columnValues[i]);
	}
});

test("test that interface matches joi validator", () => {
	throw new Error("Not implemented");
});