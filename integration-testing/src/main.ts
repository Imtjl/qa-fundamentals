import { exportComparisonCSV } from './export-csv';
import { systemFunctionStub } from './stubs';
import { systemFunction } from './system';

/**
 * Main function to generate CSV files with function values
 */
function main() {
	console.log('Generating CSV files for function visualization...');

	// trigonometric part (x ≤ 0)
	exportComparisonCSV(
		'export/trig_part.csv',
		-1.5,
		-0.01,
		0.01,
		systemFunction,
		systemFunctionStub,
	);

	// logarithmic part (x > 0)
	exportComparisonCSV(
		'export/log_part.csv',
		0.01,
		5,
		0.01,
		systemFunction,
		systemFunctionStub,
	);

	// around transition point with higher resolution
	exportComparisonCSV(
		'export/transition.csv',
		-0.1,
		0.1,
		0.001,
		systemFunction,
		systemFunctionStub,
	);

	console.log('All files generated successfully.');
}

main();
