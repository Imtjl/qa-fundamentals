import { exportToCSV } from '../src/export-csv';
import * as math from '../src/math';
import * as systemFuncModule from '../src/system';
import * as fs from 'fs';

// Mock the math module to track function calls
jest.mock('../src/math', () => {
	const math = jest.requireActual('../src/math');
	return {
		...math,
		taylorSin: jest.fn(math.taylorSin),
		taylorCos: jest.fn(math.taylorCos),
		taylorSec: jest.fn(math.taylorSec),
		taylorCsc: jest.fn(math.taylorCsc),
		taylorLn: jest.fn(math.taylorLn),
		taylorLog: jest.fn(math.taylorLog),
	};
});

// prevent actual file writing during tests
jest.mock('fs', () => ({
	writeFileSync: jest.fn(),
}));

describe('System Function Integration Tests', () => {
	const { systemFunction } = systemFuncModule;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('For x ≤ 0 (Trigonometric part)', () => {
		test('should integrate correctly with taylorCsc, taylorSec, and taylorCos', () => {
			const x = -0.5;

			const result = systemFunction(x, 15);
expect(math.taylorCsc).toHaveBeenCalledWith(x, 15);
			expect(math.taylorSec).toHaveBeenCalledWith(x, 15);
			expect(math.taylorCos).toHaveBeenCalledWith(x, 15);

			expect(result).toBeDefined();
		});

		test('should handle special values correctly', () => {
			// x = 0, sin(0) = 0, so csc(0) should be NaN
			const result = systemFunction(0, 15);

			expect(math.taylorCsc).toHaveBeenCalledWith(0, 15);
			expect(isNaN(result)).toBe(true);
		});

		test('should integrate with the correct mathematical formula', () => {
			const x = -0.4;

			(math.taylorCsc as jest.Mock).mockReturnValueOnce(-2.5);
			(math.taylorSec as jest.Mock).mockReturnValueOnce(1.1);
			(math.taylorCos as jest.Mock).mockReturnValueOnce(0.9);

			const result = systemFunction(x, 15);

			// Expected: (csc(x) - sec(x)) - cos(x) = (-2.5 - 1.1) - 0.9 = -4.5
			expect(result).toBeCloseTo(-4.5, 5);
		});
	});

	describe('For x > 0 (Logarithmic part)', () => {
		test('should integrate correctly with taylorLn and taylorLog', () => {
			const x = 2;

			const result = systemFunction(x, 15);

			expect(math.taylorLn).toHaveBeenCalled();
			expect(math.taylorLog).toHaveBeenCalled();

			expect(result).toBeDefined();
		});

		test('should integrate with the correct mathematical formula', () => {
			const x = 3;

			// Set up mocked return values for a simple test case
			(math.taylorLn as jest.Mock)
				.mockReturnValueOnce(1.1) // ln(3)
				.mockReturnValueOnce(1.61) // ln(5)
				.mockReturnValueOnce(1.1) // ln(3) again
				.mockReturnValueOnce(1.1) // ln(3) again for log3
				.mockReturnValueOnce(1.1); // ln(3) again

			(math.taylorLog as jest.Mock).mockReturnValueOnce(0.48); // log10(3)

			const result = systemFunction(x, 15);

			// Calculate expected value:
			// log5(3) = ln(3)/ln(5) = 1.1/1.61 = 0.68
			// log3(3) = 1
			const log5x = 1.1 / 1.61; // ≈ 0.68
			const log3x = 1; // simplified because log3(3) = 1
			const log10x = 0.48;
			const lnx = 1.1;

			const numerator = Math.pow(log5x - lnx, 4) * Math.pow(log5x + log3x, 3);
			const denominator = log10x * lnx;
			const expected = numerator / denominator;

			expect(result).toBeCloseTo(expected, 5);
		});

		test('should handle potential division by zero', () => {
			// Let's make the denominator zero by mocking log10(x) to return 0
			(math.taylorLog as jest.Mock).mockReturnValueOnce(0);

			const result = systemFunction(1, 15);

			expect(isNaN(result)).toBe(true);
		});
	});

	describe('CSV Export Integration', () => {
		test('should correctly export function values to CSV', () => {
			// Call the export function
			exportToCSV('test.csv', -1, 1, 0.5, systemFunction);

			// Verify that writeFileSync was called once
			expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

			// Verify that writeFileSync was called with correct filename
			expect(fs.writeFileSync).toHaveBeenCalledWith(
				'test.csv',
				expect.any(String),
			);

			// Get the data that was passed to writeFileSync
			const csvData = (fs.writeFileSync as jest.Mock).mock.calls[0][1];

			// Verify that the CSV has the expected format
			expect(csvData).toContain('x,y');
			expect(csvData.split('\n').length).toBeGreaterThan(2); // Header + at least one data row
		});

		test('should handle NaN values in CSV export', () => {
			// Mock systemFunction to return NaN for x = 0
			const originalSystemFunc = systemFuncModule.systemFunction;
			jest
				.spyOn(systemFuncModule, 'systemFunction')
				.mockImplementation((x) => (x === 0 ? NaN : originalSystemFunc(x)));

			// Call the export function
			exportToCSV('nan_test.csv', -0.5, 0.5, 0.5, systemFunction);

			// Get the data that was passed to writeFileSync
			const csvData = (fs.writeFileSync as jest.Mock).mock.calls[0][1];

			// Verify that NaN is handled correctly
			expect(csvData).toContain('0,NaN');

			// Restore the original implementation
			(systemFuncModule.systemFunction as jest.Mock).mockRestore();
		});
	});

	describe('End-to-End Integration', () => {
		// Restore actual implementations for end-to-end test
		beforeEach(() => {
			(math.taylorCsc as jest.Mock).mockImplementation(
				jest.requireActual('../src/math').taylorCsc,
			);
			(math.taylorSec as jest.Mock).mockImplementation(
				jest.requireActual('../src/math').taylorSec,
			);
			(math.taylorCos as jest.Mock).mockImplementation(
				jest.requireActual('../src/math').taylorCos,
			);
			(math.taylorLn as jest.Mock).mockImplementation(
				jest.requireActual('../src/math').taylorLn,
			);
			(math.taylorLog as jest.Mock).mockImplementation(
				jest.requireActual('../src/math').taylorLog,
			);
		});

		test('should produce reasonable results for trigonometric part', () => {
			const result = systemFunction(-0.5, 20);
			expect(isNaN(result)).toBe(false);
		});

		test('should produce reasonable results for logarithmic part', () => {
			const result = systemFunction(2, 20);
			expect(isNaN(result)).toBe(false);
		});

		test('should handle the boundary condition correctly', () => {
			// At x = 0, we expect NaN because sin(0) = 0, making csc(0) undefined
			const result = systemFunction(0, 20);
			expect(isNaN(result)).toBe(true);
		});
	});
});
