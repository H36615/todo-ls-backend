
export function mockLogger(logError: (errorMessage: string) => void): void {
	(logError as jest.Mock).mockImplementation(
		() => ({})
	);
}