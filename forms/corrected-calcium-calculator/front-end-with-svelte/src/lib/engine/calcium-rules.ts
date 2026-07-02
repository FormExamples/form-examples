import type { ClassificationRule } from './types';

/**
 * Declarative corrected-calcium constants and rules.
 *
 * Unlike an additive score, the corrected calcium is a *formula*: the corrected
 * value is computed once (see `calcium-calculator.ts`) and then classified
 * against the adult reference range. The rules below describe the three
 * reference-range classification bands, evaluated against the unrounded
 * corrected value. Rows mirror the
 * `corrected_calcium_calculator_grade_rule` SQL table.
 */

/** Reference (normal) albumin in g/L that results are corrected to. */
export const REF_ALBUMIN = 40;
/** Adjustment factor in mmol/L per g/L of albumin below/above the reference. */
export const FACTOR = 0.02;
/** Lower bound of the adult corrected-calcium reference range (mmol/L, inclusive). */
export const LOW = 2.2;
/** Upper bound of the adult corrected-calcium reference range (mmol/L, inclusive). */
export const HIGH = 2.6;
/** Severe-hypercalcaemia threshold (mmol/L, inclusive). */
export const SEVERE_HIGH = 3.0;
/** Severe-hypocalcaemia threshold (mmol/L, exclusive lower). */
export const SEVERE_LOW = 1.9;

/**
 * Reference-range classification rules, evaluated against the unrounded
 * corrected calcium value. Boundaries 2.20 and 2.60 are inclusive-to-normal.
 */
export const classificationRules: ClassificationRule[] = [
	{
		id: 'R-CLASSIFY-HYPOCALCAEMIA-01',
		instrument: 'classification',
		band: 'hypocalcaemia',
		category: 'reference-range',
		description: 'Corrected calcium below 2.20 mmol/L — hypocalcaemia',
		evaluate: (c) => c < LOW
	},
	{
		id: 'R-CLASSIFY-NORMAL-01',
		instrument: 'classification',
		band: 'normal',
		category: 'reference-range',
		description: 'Corrected calcium within 2.20-2.60 mmol/L — normal adult reference range',
		evaluate: (c) => c >= LOW && c <= HIGH
	},
	{
		id: 'R-CLASSIFY-HYPERCALCAEMIA-01',
		instrument: 'classification',
		band: 'hypercalcaemia',
		category: 'reference-range',
		description: 'Corrected calcium above 2.60 mmol/L — hypercalcaemia',
		evaluate: (c) => c > HIGH
	}
];
