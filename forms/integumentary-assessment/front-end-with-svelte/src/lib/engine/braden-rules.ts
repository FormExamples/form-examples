import type { BradenRule } from './types';

/**
 * Braden Scale subscale rules.
 *
 * The Braden Scale for Predicting Pressure Sore Risk (Bergstrom et al. 1987)
 * is composed of six subscales. Five are scored 1-4 and one
 * (Friction & Shear) is scored 1-3, giving a possible total of 6-23 (lower
 * scores indicate higher risk). Unanswered subscales return 0 from
 * `evaluate()` and are excluded from the answered-count by the grader.
 */

/** Coerce a nullable subscale value to a numeric score (0 when unanswered). */
function nullableInt(v: number | null): number {
	if (v === null || v === undefined) return 0;
	const n = Number(v);
	if (Number.isNaN(n)) return 0;
	return n;
}

export const bradenRules: BradenRule[] = [
	{
		id: 'BRADEN-001',
		category: 'Sensory Perception',
		description: 'Ability to respond meaningfully to pressure-related discomfort.',
		maxScore: 4,
		evaluate: (d) => nullableInt(d.bradenScale.sensoryPerception)
	},
	{
		id: 'BRADEN-002',
		category: 'Moisture',
		description: 'Degree to which skin is exposed to moisture.',
		maxScore: 4,
		evaluate: (d) => nullableInt(d.bradenScale.moisture)
	},
	{
		id: 'BRADEN-003',
		category: 'Activity',
		description: 'Degree of physical activity.',
		maxScore: 4,
		evaluate: (d) => nullableInt(d.bradenScale.activity)
	},
	{
		id: 'BRADEN-004',
		category: 'Mobility',
		description: 'Ability to change and control body position.',
		maxScore: 4,
		evaluate: (d) => nullableInt(d.bradenScale.mobility)
	},
	{
		id: 'BRADEN-005',
		category: 'Nutrition',
		description: 'Usual food intake pattern.',
		maxScore: 4,
		evaluate: (d) => nullableInt(d.bradenScale.nutrition)
	},
	{
		id: 'BRADEN-006',
		category: 'Friction and Shear',
		description: 'Friction & shear during repositioning and transfers.',
		maxScore: 3,
		evaluate: (d) => nullableInt(d.bradenScale.frictionShear)
	}
];
