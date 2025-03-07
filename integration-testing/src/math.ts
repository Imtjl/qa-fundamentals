/**
 * factorial of n (n >= 0).
 */
export function factorial(n: number): number {
	if (n === 0 || n === 1) return 1;
	let result = 1;
	for (let i = 2; i <= n; i++) {
		result *= i;
	}
	return result;
}

/**
 * sin(x) via Taylor series.
 */
export function taylorSin(x: number, terms: number = 10): number {
	// sin(x) = Σ [(-1)^n * x^(2n+1) / (2n+1)!], n=0..(terms-1)
	let result = 0;
	for (let n = 0; n < terms; n++) {
		const numerator = (-1) ** n * x ** (2 * n + 1);
		const denominator = factorial(2 * n + 1);
		result += numerator / denominator;
	}
	return result;
}

/**
 * cos(x) derived from sin(x + π/2).
 */
export function taylorCos(x: number, terms: number = 10): number {
	return taylorSin(x + Math.PI / 2, terms);
}

/**
 * tan(x) = sin(x)/cos(x).
 */
export function taylorTan(x: number, terms: number = 10): number {
	const cosX = taylorCos(x, terms);
	if (Math.abs(cosX) < 1e-3) return NaN;
	const sinX = taylorSin(x, terms);
	return sinX / cosX;
}

/**
 * e^x via Taylor series.
 */
export function taylorExp(x: number, terms: number = 10): number {
	let result = 0;
	for (let n = 0; n < terms; n++) {
		result += x ** n / factorial(n);
	}
	return result;
}

/**
 * ln(x) via a rough Taylor series (only valid for x>0).
 */
export function taylorLn(x: number, terms: number = 10): number {
	if (x <= 0) return NaN;
	// naive expansion around 1:
	// ln(x) ~ Σ [(-1)^(n+1) * (x-1)^n / (n)], n=1..(terms-1)
	// (not very accurate for x far from 1, but used for demonstration.)
	let result = 0;
	for (let n = 1; n < terms; n++) {
		const numerator = (-1) ** (n + 1) * (x - 1) ** n;
		result += numerator / n;
	}
	return result;
}

/**
 * sqrt(x) = e^(ln(x)/2).
 */
export function taylorSqrt(x: number, terms: number = 10): number {
	if (x <= 0) return NaN;
	return taylorExp(taylorLn(x, terms) / 2, terms);
}

/**
 * log10(x) = ln(x)/ln(10).
 */
export function taylorLog(x: number, terms: number = 10): number {
	if (x <= 0) return NaN;
	return taylorLn(x, terms) / taylorLn(10, terms);
}

/**
 * sec(x) = 1 / cos(x).
 */
export function taylorSec(x: number, terms: number = 10): number {
	const c = taylorCos(x, terms);
	if (Math.abs(c) < 1e-3) return NaN;
	return 1 / c;
}

/**
 * csc(x) = 1 / sin(x).
 */
export function taylorCsc(x: number, terms: number = 10): number {
	const s = taylorSin(x, terms);
	if (Math.abs(s) < 1e-3) return NaN;
	return 1 / s;
}
