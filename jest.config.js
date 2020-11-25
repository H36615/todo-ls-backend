
// TODO use .ts when possible.
// https://github.com/facebook/jest/pull/10564

// eslint-disable-next-line no-undef
module.exports = {

	// To be able to use typescript test files:
	preset: "ts-jest",

	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",

	// Skip tests that match the pattern
	testPathIgnorePatterns: [
		"/node_modules/",
		"/dist",
	],

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/dist",
	],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: "v8",

	// The test environment that will be used for testing
	testEnvironment: "node",
};
