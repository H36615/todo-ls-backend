

export interface IDatabaseModel<TTable> {
	table: string,
	columns: { [P in keyof TTable]: string },
}