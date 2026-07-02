import type { ClassificationRule } from './types';

/**
 * Declarative AAA diameter-classification constants and rules.
 *
 * Unlike an additive score, the AAA result is a *classification*: the maximum
 * antero-posterior aortic diameter is classified against fixed NHS AAA
 * Screening Programme thresholds. The rules below describe the four diameter
 * bands (normal / small / medium / large), evaluated against the measured
 * diameter. Rows mirror the
 * `abdominal_aortic_aneurysm_screening_grade_rule` SQL table.
 */

/** Lower bound of a small aneurysm (cm, inclusive). Below this is normal. */
export const SMALL_MIN = 3.0;
/** Lower bound of a medium aneurysm (cm, inclusive). */
export const MEDIUM_MIN = 4.5;
/** Lower bound of a large aneurysm (cm, inclusive). */
export const LARGE_MIN = 5.5;
/** Growth (cm) over ~12 months that triggers the rapid-growth flag. */
export const RAPID_GROWTH_CM = 1.0;

/**
 * Diameter classification rules, evaluated against the measured maximum aortic
 * diameter (cm). Bands are lower-bound inclusive, upper-bound exclusive:
 * `[3.0, 4.5)` small, `[4.5, 5.5)` medium, `[5.5, ∞)` large; `< 3.0` normal.
 */
export const classificationRules: ClassificationRule[] = [
	{
		id: 'R-CLASSIFY-NORMAL-01',
		instrument: 'classification',
		band: 'normal',
		category: 'diameter-band',
		description: 'Maximum aortic diameter below 3.0 cm — no aneurysm (normal)',
		evaluate: (d) => d < SMALL_MIN
	},
	{
		id: 'R-CLASSIFY-SMALL-01',
		instrument: 'classification',
		band: 'small',
		category: 'diameter-band',
		description: 'Maximum aortic diameter 3.0-4.4 cm — small aneurysm',
		evaluate: (d) => d >= SMALL_MIN && d < MEDIUM_MIN
	},
	{
		id: 'R-CLASSIFY-MEDIUM-01',
		instrument: 'classification',
		band: 'medium',
		category: 'diameter-band',
		description: 'Maximum aortic diameter 4.5-5.4 cm — medium aneurysm',
		evaluate: (d) => d >= MEDIUM_MIN && d < LARGE_MIN
	},
	{
		id: 'R-CLASSIFY-LARGE-01',
		instrument: 'classification',
		band: 'large',
		category: 'diameter-band',
		description: 'Maximum aortic diameter 5.5 cm or more — large aneurysm',
		evaluate: (d) => d >= LARGE_MIN
	}
];
