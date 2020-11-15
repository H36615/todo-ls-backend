
export class Logger {

	public static error(message: string): void {
		console.log("Error: " + message);
	}

	public static debug(message: string): void {
		console.log(message);
	}
}