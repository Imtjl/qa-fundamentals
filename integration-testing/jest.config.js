/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['lcov', 'html', 'text'],
};
