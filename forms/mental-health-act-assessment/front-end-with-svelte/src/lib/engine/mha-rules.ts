import type { AssessmentData, Criterion, RecommendedSection, RecommendedSectionClass } from './types';

/**
 * Declarative Mental Health Act classification rules.
 *
 * This form is a DOCUMENTATION and LEGAL-COMPLETENESS instrument, not a scored
 * assessment. It maps the recommended section to a section class, then looks up
 * that class's REQUIRED SIGNATORIES and REQUIRED CRITERIA (spec §4, steps 2-3).
 * The grader (`mha-grader.ts`) marks the assessment `valid` only when every
 * required signatory is present AND every required criterion is `met` with
 * evidence; otherwise `incomplete`. It makes NO automated detention decision.
 *
 * Rows here mirror the `mental_health_act_assessment_grade_rule` SQL table.
 * Nothing in this file decides whether a person should be detained — it only
 * records what the chosen section requires.
 */

/** True when the value is a non-empty (trimmed) string. */
export function nonEmpty(s: unknown): boolean {
	return typeof s === 'string' && s.trim() !== '';
}

/**
 * Map the raw `recommendedSection` enum to the section class (spec §4 step 1).
 * An unanswered section ('') maps to 'none'.
 */
export function sectionToClass(section: RecommendedSection): RecommendedSectionClass {
	switch (section) {
		case '2':
			return 'section-2';
		case '3':
			return 'section-3';
		case '4':
			return 'section-4';
		case '5-2':
			return 'section-5-2';
		case '5-4':
			return 'section-5-4';
		case '136':
			return 'section-136';
		case 'none':
			return 'none';
		default:
			return 'none';
	}
}

// A detaining / holding class is any class other than 'none'. All of these
// deprive a person of liberty and therefore require statutory documentation.
export const DETAINING_CLASSES: RecommendedSectionClass[] = [
	'section-2',
	'section-3',
	'section-4',
	'section-5-2',
	'section-5-4',
	'section-136'
];

/** True when the class is a detaining or holding power (i.e. not 'none'). */
export function isDetaining(cls: RecommendedSectionClass): boolean {
	return DETAINING_CLASSES.indexOf(cls) !== -1;
}

// ──────────────────────────────────────────────
// Required signatories per section class (spec §4 step 2)
// ──────────────────────────────────────────────

/** A signatory-slot descriptor. `present(d)` reports whether it is documented. */
export interface SignatorySlot {
	role: string;
	label: string;
	present: (d: AssessmentData) => boolean;
}

const amhpApproved = (d: AssessmentData) => d.professionals.amhpApproved === 'yes';
const amhpPresent = (d: AssessmentData) => nonEmpty(d.professionals.amhpName);
const doctor1Present = (d: AssessmentData) => nonEmpty(d.professionals.doctor1Name);
const doctor2Present = (d: AssessmentData) => nonEmpty(d.professionals.doctor2Name);
const anyS12 = (d: AssessmentData) =>
	d.professionals.doctor1Section12Approved === 'yes' ||
	d.professionals.doctor2Section12Approved === 'yes';

export const SIGNATORIES: Record<RecommendedSectionClass, SignatorySlot[]> = {
	'section-2': [
		{
			role: 'amhp',
			label: 'AMHP approval confirmed (or nearest-relative applicant)',
			present: amhpApproved
		},
		{ role: 'doctor1', label: 'First medical recommendation', present: doctor1Present },
		{ role: 'doctor2', label: 'Second medical recommendation', present: doctor2Present },
		{ role: 's12', label: 'At least one doctor Section 12 approved', present: anyS12 }
	],
	'section-3': [
		{
			role: 'amhp',
			label: 'AMHP approval confirmed (or nearest-relative applicant)',
			present: amhpApproved
		},
		{ role: 'doctor1', label: 'First medical recommendation', present: doctor1Present },
		{ role: 'doctor2', label: 'Second medical recommendation', present: doctor2Present },
		{ role: 's12', label: 'At least one doctor Section 12 approved', present: anyS12 }
	],
	'section-4': [
		{
			role: 'amhp',
			label: 'AMHP approval confirmed (or nearest-relative applicant)',
			present: amhpApproved
		},
		{ role: 'doctor1', label: 'One medical recommendation', present: doctor1Present }
	],
	'section-5-2': [
		{
			role: 'doctor1',
			label: 'Registered clinician in charge of the patient’s treatment',
			present: doctor1Present
		}
	],
	'section-5-4': [
		{
			role: 'doctor1',
			label: 'Nurse of the prescribed class (recorded in the practitioner slot)',
			present: doctor1Present
		}
	],
	'section-136': [
		{ role: 'amhp', label: 'AMHP present at the place of safety', present: amhpPresent },
		{ role: 'doctor1', label: 'Doctor present at the place of safety', present: doctor1Present }
	],
	none: []
};

// ──────────────────────────────────────────────
// Required criteria per section class (spec §4 step 3)
// ──────────────────────────────────────────────

/** A criterion-slot descriptor. A criterion is satisfied for VALIDITY when
 * status === 'met' AND evidence is non-empty. */
export interface CriterionSlot {
	criterion: string;
	label: string;
	status: (d: AssessmentData) => Criterion;
	evidence: (d: AssessmentData) => string;
}

/** Derive the combined risk-limb status: met when any limb is met; not-met when
 * a limb is explicitly not-met and none is met; else unanswered (''). */
export function riskLimbStatus(d: AssessmentData): Criterion {
	const limbs = [d.risk.riskToOwnHealth, d.risk.riskToOwnSafety, d.risk.riskToOthers];
	if (limbs.indexOf('met') !== -1) return 'met';
	if (limbs.indexOf('not-met') !== -1) return 'not-met';
	return '';
}

const CRITERIA_MENTAL_DISORDER: CriterionSlot = {
	criterion: 'mental-disorder',
	label: 'Mental disorder of a nature or degree (criterion 1)',
	status: (d) => d.mentalDisorder.mentalDisorderPresent,
	evidence: (d) => d.mentalDisorder.mentalDisorderEvidence
};
const CRITERIA_RISK: CriterionSlot = {
	criterion: 'risk',
	label: 'Risk to own health, own safety, or others (criterion 2)',
	status: (d) => riskLimbStatus(d),
	evidence: (d) => d.risk.riskEvidence
};
const CRITERIA_LEAST_RESTRICTIVE: CriterionSlot = {
	criterion: 'least-restrictive',
	label: 'No less restrictive alternative (criterion 3)',
	status: (d) => d.leastRestrictive.leastRestrictiveMet,
	evidence: (d) => d.leastRestrictive.alternativesConsidered
};
const CRITERIA_TREATMENT: CriterionSlot = {
	criterion: 'appropriate-treatment',
	label: 'Appropriate medical treatment available (criterion 4, s3)',
	status: (d) => d.treatment.appropriateTreatmentAvailable,
	evidence: (d) => d.treatment.treatmentPlanSummary
};

const BASE_CRITERIA: CriterionSlot[] = [
	CRITERIA_MENTAL_DISORDER,
	CRITERIA_RISK,
	CRITERIA_LEAST_RESTRICTIVE
];

export const CRITERIA: Record<RecommendedSectionClass, CriterionSlot[]> = {
	'section-2': BASE_CRITERIA,
	'section-4': BASE_CRITERIA,
	'section-5-2': BASE_CRITERIA,
	'section-5-4': BASE_CRITERIA,
	'section-136': BASE_CRITERIA,
	'section-3': BASE_CRITERIA.concat([CRITERIA_TREATMENT]),
	none: []
};
