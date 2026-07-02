import type { EligibilityStatus, OutcomeRule, ScreeningData } from './types';

// Declarative breast-screening classification rules.
//
// Breast screening is NOT a numeric score: it is a first-match classification
// pathway. This module exposes two pure pieces the grader
// (`breast-screening-grader.ts`) combines:
//
//   1. deriveEligibility(d) — eligibility gate (spec §4): symptomatic first,
//      then higher-risk surveillance, then the routine age range, else eligible.
//   2. outcomeRules — an ordered list of pathway rules; the FIRST rule whose
//      `evaluate` returns true fixes the screening outcome and the outcome band.
//      A symptomatic record short-circuits to the symptomatic pathway; otherwise
//      the reading outcome maps to the outcome, refined by the five-point
//      imaging classification when the woman was recalled and assessed.
//
// Rows here mirror the `breast_screening_grade_rule` SQL table
// (rule_id, category, description) and the algorithm in spec §4.

/**
 * Eligibility gate. Pure; order matters (first match wins).
 */
export function deriveEligibility(d: ScreeningData): EligibilityStatus {
	const symptomatic = d.eligibility.symptomatic;
	const higherRisk = d.identification.higherRiskSurveillance;
	const episodeType = d.context.episodeType;
	const age = d.identification.ageYears;

	if (symptomatic === 'yes') return 'symptomatic-referral';
	if (higherRisk === 'yes' || episodeType === 'higher-risk-surveillance') {
		return 'higher-risk-surveillance';
	}
	if (age !== null && (age < 50 || age > 70) && episodeType === 'routine-recall') {
		return 'outside-age-range';
	}
	return 'eligible';
}

const cls = (d: ScreeningData): number | null => d.assessment.imagingClassification;
const recalledAndAssessed = (d: ScreeningData): boolean =>
	d.reading.readingOutcome === 'recall-for-assessment' &&
	d.assessment.assessmentPerformed === 'yes' &&
	cls(d) !== null;

/** The ordered first-match pathway rules. */
export const outcomeRules: OutcomeRule[] = [
	// ─── Symptomatic short-circuit — not a screening outcome ──────
	{
		id: 'R-SYMPTOMATIC-01',
		category: 'symptomatic',
		screeningOutcome: 'symptomatic-pathway-referral',
		outcomeBand: 'referral',
		description: 'Symptomatic — refer via the symptomatic breast pathway, not screening',
		evaluate: (d) => d.eligibility.symptomatic === 'yes'
	},

	// ─── Reading outcome: technical repeat ────────────────────────
	{
		id: 'R-TECHNICAL-REPEAT-01',
		category: 'reading-outcome',
		screeningOutcome: 'technical-repeat',
		outcomeBand: 'repeat',
		description: 'Reading outcome is technical repeat — repeat the mammogram',
		evaluate: (d) => d.reading.readingOutcome === 'technical-repeat'
	},

	// ─── Reading outcome: normal / routine recall ─────────────────
	{
		id: 'R-NORMAL-ROUTINE-01',
		category: 'reading-outcome',
		screeningOutcome: 'routine-recall',
		outcomeBand: 'routine',
		description: 'Reading outcome is normal — return to routine 3-yearly recall',
		evaluate: (d) => d.reading.readingOutcome === 'normal-routine-recall'
	},

	// ─── Recalled, not yet assessed ───────────────────────────────
	{
		id: 'R-RECALL-ASSESSMENT-01',
		category: 'recall',
		screeningOutcome: 'recall-to-assessment-clinic',
		outcomeBand: 'assessment',
		description:
			'Recall for assessment before an assessment result is recorded — book assessment clinic',
		evaluate: (d) =>
			d.reading.readingOutcome === 'recall-for-assessment' &&
			(d.assessment.assessmentPerformed !== 'yes' || cls(d) === null)
	},

	// ─── Assessed: imaging classification 1–2 → routine ───────────
	{
		id: 'R-ASSESS-CLASS-1-2-01',
		category: 'assessment-result',
		screeningOutcome: 'routine-recall',
		outcomeBand: 'routine',
		description:
			'Assessment imaging classification 1–2 (normal/benign) — return to routine recall',
		evaluate: (d) => recalledAndAssessed(d) && (cls(d) === 1 || cls(d) === 2)
	},

	// ─── Assessed: imaging classification 3 → short interval ──────
	{
		id: 'R-ASSESS-CLASS-3-01',
		category: 'assessment-result',
		screeningOutcome: 'short-interval-follow-up',
		outcomeBand: 'assessment',
		description:
			'Assessment imaging classification 3 (indeterminate) — short-interval follow-up or biopsy',
		evaluate: (d) => recalledAndAssessed(d) && cls(d) === 3
	},

	// ─── Assessed: imaging classification 4–5 → urgent ────────────
	{
		id: 'R-ASSESS-CLASS-4-5-01',
		category: 'assessment-result',
		screeningOutcome: 'urgent-breast-clinic',
		outcomeBand: 'urgent',
		description:
			'Assessment imaging classification 4–5 (suspicious/malignant) — urgent breast-clinic referral',
		evaluate: (d) => recalledAndAssessed(d) && (cls(d) === 4 || cls(d) === 5)
	}
];
