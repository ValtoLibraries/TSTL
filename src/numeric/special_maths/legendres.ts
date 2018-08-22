import { DomainError, InvalidArgument } from "../../exceptions/LogicError";

/**
 * Legendre polynomials.
 * 
 * @reference http://en.cppreference.com/w/cpp/numeric/special_math/legendre
 */
export function legendre(n: number, x: number): number
{
	return assoc_legendre(n, 0, x);
}

/**
 * Associated Legendre polynomials.
 * 
 * @reference https://en.wikipedia.org/wiki/Associated_Legendre_polynomials
 */
export function assoc_legendre(n: number, m: number, x: number): number
{
	// VALIDATE PARAMETERS
	if ((n = Math.floor(n)) < 0 || (m = Math.floor(m)) < 0)
		throw new InvalidArgument("In assoc_legendre function, both n and m must be unsigned integer");
	else if (Math.abs(x) > 1)
		throw new DomainError("assoc_legendre function requires -1 <= x <= 1");

	// MEMORIZATION
	let matrix: number[][] = [[1, x]];
	matrix.length = m + 1;
	
	for (let i: number = 1; i < matrix.length; ++i)
		matrix[i] = [];

	// COMPUTE RETURN VALUE
	return _Compute_assoc_legendre(n, m, x, matrix);
}

/**
 * @hidden
 */
function _Compute_legendre(n: number, x: number, memory: number[]): number
{
	if (memory.length > n)
		return memory[n];
	
	let pn_1: number = _Compute_legendre(n - 1, x, memory);
	let pn_2: number = _Compute_legendre(n - 2, x, memory);

	let ret: number = (2*n - 1)*x*pn_1 - (n-1)*pn_2;
	ret /= n;

	memory[n] = ret;
	return ret;
}

/**
 * @hidden
 */
function _Compute_assoc_legendre(n: number, m: number, x: number, matrix: number[][]): number
{
	if (n < 0)
		n = -n-1;

	if (m === 0)
		return _Compute_legendre(n, x, matrix[0]);
	else if (matrix[m].length > n && matrix[m][n] !== undefined)
		return matrix[m][n];

	let left: number = (n - m + 1) * (n - m + 2) * _Compute_assoc_legendre(n + 1, m - 1, x, matrix);
	let right: number = (n + m - 1) * (n + m) * _Compute_assoc_legendre(n - 1, m - 1, x, matrix);

	let ret: number = (left - right) / (2*n + 1);
	ret /= Math.sqrt(1 - x*x);

	matrix[m][n] = ret;
	return ret;
}