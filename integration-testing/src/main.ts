import { exportToCSV } from './system';

/**
 * Main function to generate CSV files with function values
 */
function main() {
	console.log('Generating CSV files for function visualization...');

	// trigonometric part (x ≤ 0)
	exportToCSV('export/trig_part.csv', -1.5, -0.01, 0.01);

	// logarithmic part (x > 0)
	exportToCSV('export/log_part.csv', 0.01, 5, 0.01);

	// around transition point with higher resolution
	exportToCSV('export/transition.csv', -0.1, 0.1, 0.001);

	console.log('All files generated successfully.');
}

main();
