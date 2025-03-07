import * as math from './math';

/**
 * Computes the system function based on the piecewise definition:
 *
 * For x ≤ 0: (csc(x) - sec(x)) - cos(x)
 * For x > 0: ((log₅(x) - ln(x))⁴ * (log₅(x) + log₃(x))³) / (log₁₀(x) * ln(x))
 *
 * @param x - The input value
 * @param terms - Number of terms to use in Taylor series approximations
 * @returns The computed function value
 */
export function systemFunction(x: number, terms: number = 10): number {
	if (x <= 0) {
		// (csc(x) - sec(x)) - cos(x)
		return (
			math.taylorCsc(x, terms) -
			math.taylorSec(x, terms) -
			math.taylorCos(x, terms)
		);
	} else {
		// ln(sin(x)), watch domain of sin(x) (must be > 0)
		const log5x = math.taylorLn(x, terms) / math.taylorLn(5, terms);
		const log3x = math.taylorLn(x, terms) / math.taylorLn(3, terms);
		const log10x = math.taylorLog(x, terms);
		const lnx = math.taylorLn(x, terms);

		// Calculate ((log₅(x) - ln(x))⁴ * (log₅(x) + log₃(x))³) / (log₁₀(x) * ln(x))
		const numerator = Math.pow(log5x - lnx, 4) * Math.pow(log5x + log3x, 3);
		const denominator = log10x * lnx;

		if (denominator === 0 || !isFinite(denominator)) {
			return NaN;
		}

		return numerator / denominator;
	}
}

/**
 * Export function values to a CSV file
 *
 * @param fileName - Output file name
 * @param startX - Start value for x
 * @param endX - End value for x
 * @param stepX - Step size for x
 */
export function exportToCSV(
	fileName: string,
	startX: number,
	endX: number,
	stepX: number,
): void {
	const fs = require('fs');
	let data = 'x,y\n';

	for (let x = startX; x <= endX; x += stepX) {
		const y = systemFunction(x);
		if (!isNaN(y) && isFinite(y)) {
			data += `${x},${y}\n`;
		} else {
			data += `${x},NaN\n`;
		}
	}

	fs.writeFileSync(fileName, data);
	console.log(`Data exported to ${fileName}`);
}
