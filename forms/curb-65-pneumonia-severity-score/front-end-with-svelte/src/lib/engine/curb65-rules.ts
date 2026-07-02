import type { Curb65Rule } from './types';

/**
 * Declarative CURB-65 grading rules.
 *
 * CURB-65 has exactly five scored criteria, each worth 0 or 1 point:
 *   C   Confusion (new-onset)
 *   U   Urea > 7 mmol/L
 *   R   Respiratory rate >= 30 breaths/min
 *   B   Blood pressure: systolic < 90 OR diastolic <= 60 mmHg
 *   65  Age >= 65 years
 *
 * Each rule evaluates the patient data and returns true when its criterion is
 * positive; the grader (`curb65-grader.ts`) sums the points into the CURB-65
 * total (0-5), or — when serum urea was not measured — the CRB-65 total (0-4,
 * omitting the urea rule). Rows mirror the
 * `curb_65_pneumonia_severity_score_grade_rule` SQL table.
 */
export const curb65Rules: Curb65Rule[] = [
	// ─── CRITERION C: CONFUSION ───────────────────────────────────
	{
		id: 'R-CONFUSION-01',
		criterion: 'confusion',
		points: 1,
		category: 'curb-65-criterion',
		description:
			'New-onset mental confusion (AMT <= 8, or new disorientation in person, place, or time)',
		evaluate: (d) => d.confusion.confusionPresent === 'yes'
	},

	// ─── CRITERION U: UREA ────────────────────────────────────────
	// Only scored when serum urea was measured; when it was not, the grader
	// computes the four-criterion CRB-65 variant and skips this rule.
	{
		id: 'R-UREA-01',
		criterion: 'urea',
		points: 1,
		category: 'curb-65-criterion',
		description: 'Serum urea > 7 mmol/L (blood urea nitrogen > 19 mg/dL)',
		evaluate: (d) =>
			d.urea.ureaMeasured === 'yes' && d.urea.ureaMmolL !== null && d.urea.ureaMmolL > 7
	},

	// ─── CRITERION R: RESPIRATORY RATE ────────────────────────────
	{
		id: 'R-RESPIRATORY-RATE-01',
		criterion: 'respiratory-rate',
		points: 1,
		category: 'curb-65-criterion',
		description: 'Respiratory rate >= 30 breaths per minute',
		evaluate: (d) =>
			d.respiratory.respiratoryRate !== null && d.respiratory.respiratoryRate >= 30
	},

	// ─── CRITERION B: BLOOD PRESSURE ──────────────────────────────
	{
		id: 'R-BLOOD-PRESSURE-01',
		criterion: 'blood-pressure',
		points: 1,
		category: 'curb-65-criterion',
		description: 'Systolic blood pressure < 90 mmHg, or diastolic <= 60 mmHg',
		evaluate: (d) =>
			(d.bloodPressure.systolicBp !== null && d.bloodPressure.systolicBp < 90) ||
			(d.bloodPressure.diastolicBp !== null && d.bloodPressure.diastolicBp <= 60)
	},

	// ─── CRITERION 65: AGE ────────────────────────────────────────
	{
		id: 'R-AGE-01',
		criterion: 'age',
		points: 1,
		category: 'curb-65-criterion',
		description: 'Age >= 65 years',
		evaluate: (d) => d.age.ageYears !== null && d.age.ageYears >= 65
	}
];
