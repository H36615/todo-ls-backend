
/**
 * This class exists if a proper logger is ever to be implemented.
 */
export class Logger {

	public static error(message: string): void {
		console.log("Error: " + message);
	}

	public static debug(message: string): void {
		console.log(message);
	}
}