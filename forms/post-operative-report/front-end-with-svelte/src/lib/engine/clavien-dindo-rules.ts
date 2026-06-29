import type { ClavienDindoRule, ClavienDindoGradeKey } from './types';

/**
 * Clavien-Dindo classification rules. Each entry maps one complication grade
 * key to its canonical label, short (Roman-numeral) label, description, and a
 * numeric ordering used to compute the overall (worst) grade.
 *
 *   Grade 0:    No complication.
 *   Grade I:    Deviation from normal course; no intervention required.
 *   Grade II:   Pharmacological treatment (incl. blood transfusion, TPN).
 *   Grade IIIa: Intervention required, without general anaesthesia.
 *   Grade IIIb: Intervention required, with general anaesthesia.
 *   Grade IVa:  Life-threatening, single-organ dysfunction.
 *   Grade IVb:  Life-threatening, multi-organ dysfunction.
 *   Grade V:    Death of the patient.
 */
export const clavienDindoRules: ClavienDindoRule[] = [
	{
		grade: 'grade-0',
		label: 'Grade 0',
		shortLabel: '0',
		description: 'No complication occurred during or after the procedure.',
		order: 0
	},
	{
		grade: 'grade-i',
		label: 'Grade I',
		shortLabel: 'I',
		description:
			'Any deviation from the normal post-operative course without pharmacological treatment or surgical, endoscopic, or radiological interventions. Allowed therapeutic regimens are antiemetics, antipyretics, analgesics, diuretics, electrolytes and physiotherapy. Wound infections opened at the bedside are also included.',
		order: 1
	},
	{
		grade: 'grade-ii',
		label: 'Grade II',
		shortLabel: 'II',
		description:
			'Requires pharmacological treatment with drugs other than those allowed for grade I. Blood transfusions and total parenteral nutrition are also included.',
		order: 2
	},
	{
		grade: 'grade-iiia',
		label: 'Grade IIIa',
		shortLabel: 'IIIa',
		description:
			'Requires surgical, endoscopic or radiological intervention not under general anaesthesia.',
		order: 3
	},
	{
		grade: 'grade-iiib',
		label: 'Grade IIIb',
		shortLabel: 'IIIb',
		description:
			'Requires surgical, endoscopic or radiological intervention under general anaesthesia.',
		order: 4
	},
	{
		grade: 'grade-iva',
		label: 'Grade IVa',
		shortLabel: 'IVa',
		description:
			'Life-threatening complication (incl. CNS complications) requiring intermediate care or intensive care unit management — single-organ dysfunction (incl. dialysis).',
		order: 5
	},
	{
		grade: 'grade-ivb',
		label: 'Grade IVb',
		shortLabel: 'IVb',
		description:
			'Life-threatening complication (incl. CNS complications) requiring intermediate care or intensive care unit management — multi-organ dysfunction.',
		order: 6
	},
	{
		grade: 'grade-v',
		label: 'Grade V',
		shortLabel: 'V',
		description: 'Death of the patient.',
		order: 7
	}
];

/** Lookup of each Clavien-Dindo rule by its grade key. */
export const clavienDindoRuleByGrade: Record<string, ClavienDindoRule> = clavienDindoRules.reduce(
	(acc, r) => {
		acc[r.grade] = r;
		return acc;
	},
	{} as Record<string, ClavienDindoRule>
);

/** Grade keys offered in the complication editor dropdown, in canonical order. */
export const gradeKeys: Exclude<ClavienDindoGradeKey, ''>[] = clavienDindoRules.map((r) => r.grade);
