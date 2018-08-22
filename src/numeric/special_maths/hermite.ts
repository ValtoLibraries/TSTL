import { InvalidArgument } from "../../exceptions/LogicError";

/**
 * Hermite polynomial
 * 
 * @reference https://en.wikipedia.org/wiki/Hermite_polynomials
 */
export function hermite(n: number, x: number): number
{
	// VALIDATE PARAMETER
	if ((n = Math.floor(n)) < 0)
		throw new InvalidArgument("In hermite function, n must be unsigned integer.");

	// MEMORIZATION
	let solutions: number[] = [1, 2*x];

	// COMPUTE RETURN VALUE
	return _Hermite(n, x, solutions);
}

/**
 * @hidden
 */
function _Hermite(n: number, x: number, solutions: number[]): number
{
	if (solutions.length > n)
		return solutions[n];

	let hn_1: number = _Hermite(n - 1, x, solutions);
	let hn_2: number = _Hermite(n - 2, x, solutions);

	let ret: number = x*hn_1 - (n-1)*hn_2;
	ret *= 2;

	solutions[n] = ret;
	return ret;
}