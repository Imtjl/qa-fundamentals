/**
 * Table stubs for math functions
 * Used in integration testing
 */

/**
 * Factorial stub
 */
export const factorialStub = (n: number): number => {
	const factorialTable: { [key: number]: number } = {
		0: 1,
		1: 1,
		2: 2,
		3: 6,
		4: 24,
		5: 120,
		6: 720,
		7: 5040,
		8: 40320,
		9: 362880,
		10: 3628800,
	};

	if (n in factorialTable) {
		return factorialTable[n];
	}

	// For n > 10 return approximate value
	return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
};

/**
 * Sine stub
 */
export const sinStub = (x: number): number => {
	// Normalize x to range -2π to 2π
	const normalized = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

	// Table of pre-calculated sin(x) values for key angles
	const sinTable: { [key: number]: number } = {
		0: 0,
		[Math.PI / 6]: 0.5,
		[Math.PI / 4]: 0.7071,
		[Math.PI / 3]: 0.866,
		[Math.PI / 2]: 1,
		[(2 * Math.PI) / 3]: 0.866,
		[(3 * Math.PI) / 4]: 0.7071,
		[(5 * Math.PI) / 6]: 0.5,
		[Math.PI]: 0,
		[(7 * Math.PI) / 6]: -0.5,
		[(5 * Math.PI) / 4]: -0.7071,
		[(4 * Math.PI) / 3]: -0.866,
		[(3 * Math.PI) / 2]: -1,
		[(5 * Math.PI) / 3]: -0.866,
		[(7 * Math.PI) / 4]: -0.7071,
		[(11 * Math.PI) / 6]: -0.5,
		[2 * Math.PI]: 0,
	};

	// Find closest key in table
	const roundedKey = Object.keys(sinTable)
		.map(Number)
		.find((key) => Math.abs(normalized - key) < 0.0001);

	if (roundedKey !== undefined) {
		return sinTable[roundedKey];
	}

	// Fall back to built-in function
	return Math.sin(x);
};

/**
 * Cosine stub
 */
export const cosStub = (x: number): number => {
	// Cosine can be expressed using sine: cos(x) = sin(x + π/2)
	return sinStub(x + Math.PI / 2);
};

/**
 * Secant stub
 */
export const secStub = (x: number): number => {
	const cosValue = cosStub(x);

	// Check division by zero
	if (Math.abs(cosValue) < 1e-10) {
		return NaN;
	}

	return 1 / cosValue;
};

/**
 * Cosecant stub
 */
export const cscStub = (x: number): number => {
	const sinValue = sinStub(x);

	// Check division by zero
	if (Math.abs(sinValue) < 1e-10) {
		return NaN;
	}

	return 1 / sinValue;
};

/**
 * Tangent stub
 */
export const tanStub = (x: number): number => {
	const cosValue = cosStub(x);

	// Check division by zero
	if (Math.abs(cosValue) < 1e-10) {
		return NaN;
	}

	return sinStub(x) / cosValue;
};

/**
 * Exponential stub
 */
export const expStub = (x: number): number => {
	// Table of pre-calculated e^x values
	const expTable: { [key: number]: number } = {
		[-2]: 0.1353,
		[-1]: 0.3679,
		[-0.5]: 0.6065,
		0: 1,
		0.5: 1.6487,
		1: 2.7183, // e
		2: 7.3891,
		3: 20.0855,
	};

	// Find closest key in table
	const roundedKey = Object.keys(expTable)
		.map(Number)
		.find((key) => Math.abs(x - key) < 0.0001);

	if (roundedKey !== undefined) {
		return expTable[roundedKey];
	}

	// Fall back to built-in function
	return Math.exp(x);
};

/**
 * Natural logarithm stub
 */
export const lnStub = (x: number): number => {
	// Logarithm only defined for positive numbers
	if (x <= 0) {
		return NaN;
	}

	// Table of pre-calculated ln(x) values
	const lnTable: { [key: number]: number } = {
		0.1: -2.3026,
		0.2: -1.6094,
		0.5: -0.6931,
		1: 0,
		2: 0.6931,
		2.71828: 1, // e
		3: 1.0986,
		5: 1.6094,
		10: 2.3026,
	};

	// Find closest key in table
	const roundedKey = Object.keys(lnTable)
		.map(Number)
		.find((key) => Math.abs(x - key) < 0.0001);

	if (roundedKey !== undefined) {
		return lnTable[roundedKey];
	}

	// Fall back to built-in function for better accuracy
	return Math.log(x);
};

/**
 * Base-3 logarithm stub
 */
export const log3Stub = (x: number): number => {
	// Logarithm only defined for positive numbers
	if (x <= 0) {
		return NaN;
	}

	// Table of pre-calculated log3(x) values
	const log3Table: { [key: number]: number } = {
		1: 0,
		3: 1,
		9: 2,
		27: 3,
		81: 4,
	};

	// Find closest key in table
	const roundedKey = Object.keys(log3Table)
		.map(Number)
		.find((key) => Math.abs(x - key) < 0.0001);

	if (roundedKey !== undefined) {
		return log3Table[roundedKey];
	}

	// Calculate using change of base formula with built-in function
	return Math.log(x) / Math.log(3);
};

/**
 * Base-5 logarithm stub
 */
export const log5Stub = (x: number): number => {
	// Logarithm only defined for positive numbers
	if (x <= 0) {
		return NaN;
	}

	// Table of pre-calculated log5(x) values
	const log5Table: { [key: number]: number } = {
		1: 0,
		5: 1,
		25: 2,
		125: 3,
		625: 4,
	};

	// Find closest key in table
	const roundedKey = Object.keys(log5Table)
		.map(Number)
		.find((key) => Math.abs(x - key) < 0.0001);

	if (roundedKey !== undefined) {
		return log5Table[roundedKey];
	}

	// Calculate using change of base formula with built-in function
	return Math.log(x) / Math.log(5);
};

/**
 * Base-10 logarithm stub
 */
export const log10Stub = (x: number): number => {
	// Logarithm only defined for positive numbers
	if (x <= 0) {
		return NaN;
	}

	// Table of pre-calculated log10(x) values
	const log10Table: { [key: number]: number } = {
		0.1: -1,
		0.01: -2,
		0.001: -3,
		1: 0,
		10: 1,
		100: 2,
		1000: 3,
	};

	// Find closest key in table
	const roundedKey = Object.keys(log10Table)
		.map(Number)
		.find((key) => Math.abs(x - key) < 0.0001);

	if (roundedKey !== undefined) {
		return log10Table[roundedKey];
	}

	// Use built-in function for better accuracy
	return Math.log10(x);
};

/**
 * Square root stub
 */
export const sqrtStub = (x: number): number => {
	// Square root only defined for non-negative numbers
	if (x < 0) {
		return NaN;
	}

	// Table of pre-calculated sqrt(x) values
	const sqrtTable: { [key: number]: number } = {
		0: 0,
		1: 1,
		4: 2,
		9: 3,
		16: 4,
		25: 5,
		36: 6,
		49: 7,
		64: 8,
		81: 9,
		100: 10,
	};

	// Find closest key in table
	const roundedKey = Object.keys(sqrtTable)
		.map(Number)
		.find((key) => Math.abs(x - key) < 0.0001);

	if (roundedKey !== undefined) {
		return sqrtTable[roundedKey];
	}

	// Fall back to built-in function
	return Math.sqrt(x);
};

/**
 * Trigonometric part stub
 */
export const trigFunctionStub = (x: number): number => {
	return cscStub(x) - secStub(x) - cosStub(x);
};

/**
 * Logarithmic part stub
 */
export const logFunctionStub = (x: number): number => {
	// Only defined for positive x
	if (x <= 0) {
		return NaN;
	}

	// Always calculate using component stubs for tests to work
	const log5x = log5Stub(x);
	const log3x = log3Stub(x);
	const log10x = log10Stub(x);
	const lnx = lnStub(x);

	const numerator = Math.pow(log5x - lnx, 4) * Math.pow(log5x + log3x, 3);
	const denominator = log10x * lnx;

	if (denominator === 0 || !isFinite(denominator)) {
		return NaN;
	}

	return numerator / denominator;
}

/**
 * System function stub
 */
export function systemFunctionStub(x: number): number {
	if (x <= 0) {
		return trigFunctionStub(x);
	} else {
		return logFunctionStub(x);
	}
}
