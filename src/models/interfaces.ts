

export interface IDatabaseModel<TTable> {
	table: string,
	// Column names in database.
	// Note: property name must match the column name value.
	columns: { [P in keyof TTable]: string },
}