import type { CategoryDef } from './types';

/**
 * Declarative Waterlow scoring rules.
 *
 * The Waterlow score is a summed weighted score: each core category maps its
 * single selected option to points; the sex-and-age category adds the sex
 * points plus the age-band points; each special-risk group maps its highest
 * applicable option to points. This file holds the per-category point maps and
 * the category metadata used by `waterlow-grader.ts` to build the
 * contributing-categories breakdown. The point maps mirror spec §4 and the
 * `waterlow_pressure_ulcer_risk_assessment_grade_rule` SQL table.
 */

// Per-category option -> points maps (spec §4). An unlisted or '' value scores 0.
export const POINT_MAPS: Record<string, Record<string, number>> = {
	buildWeightForHeight: {
		average: 0,
		'above-average': 1,
		obese: 2,
		'below-average': 3
	},
	skinType: {
		healthy: 0,
		'tissue-paper': 1,
		dry: 1,
		oedematous: 1,
		'clammy-pyrexial': 1,
		discoloured: 2,
		broken: 3
	},
	sex: { male: 1, female: 2 },
	ageBand: { '14-49': 1, '50-64': 2, '65-74': 3, '75-80': 4, '81-plus': 5 },
	continence: {
		'complete-catheterised': 0,
		'incontinent-urine': 1,
		'incontinent-faeces': 2,
		'doubly-incontinent': 3
	},
	mobility: {
		'fully-mobile': 0,
		restless: 1,
		apathetic: 2,
		restricted: 3,
		bedbound: 4,
		chairbound: 5
	},
	tissueMalnutrition: {
		none: 0,
		smoking: 1,
		anaemia: 2,
		'peripheral-vascular-disease': 5,
		'single-organ-failure': 5,
		'multiple-organ-failure': 8,
		'terminal-cachexia': 8
	},
	neurologicalDeficit: { none: 0, mild: 4, moderate: 5, severe: 6 },
	majorSurgeryTrauma: {
		none: 0,
		'orthopaedic-spinal': 5,
		'on-table-over-2h': 5,
		'on-table-over-6h': 8
	},
	medication: { none: 0, 'high-dose-steroids-cytotoxics-anti-inflammatory': 4 }
};

/**
 * Points contributed by a category for a selected value. Returns 0 for an
 * unanswered ('') or unrecognised value.
 */
export function pointsFor(map: string, value: string): number {
	const table = POINT_MAPS[map];
	if (!table) return 0;
	return Object.prototype.hasOwnProperty.call(table, value) ? table[value] : 0;
}

// Ordered category definitions. Sex and age live in the identification section
// but are scored core categories; the four special-risk groups follow.
export const categoryDefs: CategoryDef[] = [
	{
		key: 'build',
		section: 'core',
		field: 'buildWeightForHeight',
		map: 'buildWeightForHeight',
		pointsField: 'buildPoints',
		label: 'Build / weight for height',
		core: true
	},
	{
		key: 'skin',
		section: 'core',
		field: 'skinType',
		map: 'skinType',
		pointsField: 'skinPoints',
		label: 'Skin type / visual risk',
		core: true
	},
	{
		key: 'sex',
		section: 'identification',
		field: 'sex',
		map: 'sex',
		pointsField: 'sexPoints',
		label: 'Sex',
		core: true
	},
	{
		key: 'age',
		section: 'identification',
		field: 'ageBand',
		map: 'ageBand',
		pointsField: 'agePoints',
		label: 'Age band',
		core: true
	},
	{
		key: 'continence',
		section: 'core',
		field: 'continence',
		map: 'continence',
		pointsField: 'continencePoints',
		label: 'Continence',
		core: true
	},
	{
		key: 'mobility',
		section: 'core',
		field: 'mobility',
		map: 'mobility',
		pointsField: 'mobilityPoints',
		label: 'Mobility',
		core: true
	},
	{
		key: 'tissueMalnutrition',
		section: 'special',
		field: 'tissueMalnutrition',
		map: 'tissueMalnutrition',
		pointsField: 'tissueMalnutritionPoints',
		label: 'Tissue malnutrition',
		core: false,
		special: true
	},
	{
		key: 'neurologicalDeficit',
		section: 'special',
		field: 'neurologicalDeficit',
		map: 'neurologicalDeficit',
		pointsField: 'neurologicalDeficitPoints',
		label: 'Neurological deficit',
		core: false,
		special: true
	},
	{
		key: 'majorSurgeryTrauma',
		section: 'special',
		field: 'majorSurgeryTrauma',
		map: 'majorSurgeryTrauma',
		pointsField: 'majorSurgeryTraumaPoints',
		label: 'Major surgery or trauma',
		core: false,
		special: true
	},
	{
		key: 'medication',
		section: 'special',
		field: 'medication',
		map: 'medication',
		pointsField: 'medicationPoints',
		label: 'Medication',
		core: false,
		special: true
	}
];
