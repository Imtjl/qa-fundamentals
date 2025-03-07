import * as fs from 'fs';

/**
 * Exports function values to a CSV file
 *
 * @param fileName - The name of the output file
 * @param startX - The starting value of x
 * @param endX - The ending value of x
 * @param step - The step size for incrementing x
 * @param func - The function to evaluate
 * @param terms - The number of terms to use in the approximation (default: 10)
 */
export function exportToCSV(
	fileName: string,
	startX: number,
	endX: number,
	step: number,
	func: (x: number, terms?: number) => number,
	terms: number = 10,
): void {
	let csvContent = `x,y\n`;

	for (let x = startX; x <= endX; x += step) {
		const result = func(x, terms);

		// Only include valid numerical results
		if (!isNaN(result) && isFinite(result)) {
			csvContent += `${x},${result}\n`;
		} else {
			csvContent += `${x},NaN\n`;
		}
	}

	fs.writeFileSync(fileName, csvContent);
	console.log(`Data exported to ${fileName}`);
}

/**
 * Exports comparison of two functions to a CSV file
 *
 * @param fileName - The name of the output file
 * @param startX - The starting value of x
 * @param endX - The ending value of x
 * @param step - The step size for incrementing x
 * @param realFunc - The real function to evaluate
 * @param stubFunc - The stub function to evaluate
 */
export function exportComparisonCSV(
	fileName: string,
	startX: number,
	endX: number,
	step: number,
	realFunc: (x: number) => number,
	stubFunc: (x: number) => number,
): void {
	let data = 'x,real,stub,difference\n';

	for (let x = startX; x <= endX; x += step) {
		const realValue = realFunc(x);
		const stubValue = stubFunc(x);
		const difference =
			isNaN(realValue) || isNaN(stubValue)
				? 'NaN'
				: Math.abs(realValue - stubValue);

		data += `${x},${isNaN(realValue) ? 'NaN' : realValue},${isNaN(stubValue) ? 'NaN' : stubValue},${difference}\n`;
	}

	fs.writeFileSync(fileName, data);
	console.log(`Data exported to ${fileName}`);
}
