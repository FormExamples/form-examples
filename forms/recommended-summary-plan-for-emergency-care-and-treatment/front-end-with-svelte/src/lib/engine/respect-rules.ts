import type { AssessmentData, FieldSlot, RespectRule } from './types';

/**
 * Declarative ReSPECT completeness / validity rules.
 *
 * ReSPECT is a documentation instrument, not a scored assessment. It has
 * exactly eight MANDATORY rules (spec §4). Each rule evaluates the plan and
 * returns true when its mandatory content / process requirement is satisfied;
 * the grader (`respect-grader.ts`) marks the plan `complete` only when every
 * rule is satisfied, otherwise `incomplete`. Rows mirror the
 * `respect_grade_rule` SQL table (rule_id, rule, category, description).
 */

const nonEmpty = (s: string): boolean => typeof s === 'string' && s.trim() !== '';

export const mandatoryRules: RespectRule[] = [
	// ─── R1: PERSONAL DETAILS IDENTIFY THE PERSON ─────────────────
	{
		id: 'R-IDENTITY-01',
		rule: 'identity',
		category: 'personal-details',
		description:
			'Personal details identify the person: name, date of birth, and an identifier are all recorded',
		evaluate: (p) =>
			nonEmpty(p.personal.personName) &&
			nonEmpty(p.personal.dateOfBirth) &&
			nonEmpty(p.personal.identifier)
	},

	// ─── R2: SUMMARY OF RELEVANT HEALTH ───────────────────────────
	{
		id: 'R-HEALTH-SUMMARY-01',
		rule: 'healthSummary',
		category: 'summary-of-health',
		description: 'A summary of relevant health is recorded',
		evaluate: (p) => nonEmpty(p.health.healthSummary)
	},

	// ─── R3: PREFERENCES / WHAT MATTERS ───────────────────────────
	{
		id: 'R-PREFERENCES-01',
		rule: 'preferences',
		category: 'preferences',
		description: 'Personal preferences / what matters to the person are recorded',
		evaluate: (p) =>
			nonEmpty(p.preferences.whatMatters) || nonEmpty(p.preferences.carePreferences)
	},

	// ─── R4: CLINICAL RECOMMENDATIONS ─────────────────────────────
	{
		id: 'R-RECOMMENDATIONS-01',
		rule: 'recommendations',
		category: 'clinical-recommendations',
		description:
			'Clinical recommendations are recorded, including the life-sustaining / comfort balance and at least one recommended or not-recommended intervention',
		evaluate: (p) =>
			nonEmpty(p.recommendations.priorityBalance) &&
			(nonEmpty(p.recommendations.recommendedInterventions) ||
				nonEmpty(p.recommendations.notRecommendedInterventions))
	},

	// ─── R5: CPR RECOMMENDATION ───────────────────────────────────
	{
		id: 'R-CPR-01',
		rule: 'cpr',
		category: 'cpr-recommendation',
		description: 'A CPR recommendation is documented (attempt or do-not-attempt)',
		evaluate: (p) =>
			p.cpr.cprRecommendation === 'attempt' || p.cpr.cprRecommendation === 'do-not-attempt'
	},

	// ─── R6: CEILINGS OF TREATMENT ────────────────────────────────
	{
		id: 'R-CEILINGS-01',
		rule: 'ceilings',
		category: 'ceilings-of-treatment',
		description: 'Ceilings of treatment are recorded',
		evaluate: (p) =>
			nonEmpty(p.ceilings.hospitalTransfer) ||
			nonEmpty(p.ceilings.criticalCareAdmission) ||
			nonEmpty(p.ceilings.treatmentCeilings)
	},

	// ─── R7: CAPACITY AND INVOLVEMENT (CONDITIONAL) ───────────────
	{
		id: 'R-CAPACITY-01',
		rule: 'capacity',
		category: 'capacity-and-involvement',
		description:
			'Capacity is recorded; if the person lacks capacity, a capacity assessment and legal-proxy / consultee involvement are documented (Mental Capacity Act 2005)',
		evaluate: (p) =>
			nonEmpty(p.capacity.hasCapacity) &&
			(p.capacity.hasCapacity === 'yes' ||
				(nonEmpty(p.capacity.capacityAssessment) &&
					nonEmpty(p.capacity.involvement) &&
					p.capacity.involvement !== 'person'))
	},

	// ─── R8: CLINICIAN SIGN-OFF ───────────────────────────────────
	{
		id: 'R-SIGN-OFF-01',
		rule: 'signOff',
		category: 'clinician-sign-off',
		description: 'The plan is signed by the completing clinician, with role and date',
		evaluate: (p) =>
			nonEmpty(p.signOff.clinicianName) &&
			nonEmpty(p.signOff.clinicianRole) &&
			nonEmpty(p.signOff.signature) &&
			nonEmpty(p.signOff.signedAt)
	}
];

/**
 * Completeness field-slots. `completenessPercent` counts populated mandatory
 * fields over the fields that apply. Fourteen slots always apply; the
 * conditional capacity-proxy slot only enters the denominator when the person
 * lacks capacity, so a plan for a person WITH capacity reaches 100% without it.
 */
export const completenessSlots: FieldSlot[] = [
	{ key: 'personName', present: (p) => nonEmpty(p.personal.personName) },
	{ key: 'dateOfBirth', present: (p) => nonEmpty(p.personal.dateOfBirth) },
	{ key: 'identifier', present: (p) => nonEmpty(p.personal.identifier) },
	{ key: 'healthSummary', present: (p) => nonEmpty(p.health.healthSummary) },
	{
		key: 'preferences',
		present: (p) =>
			nonEmpty(p.preferences.whatMatters) || nonEmpty(p.preferences.carePreferences)
	},
	{ key: 'priorityBalance', present: (p) => nonEmpty(p.recommendations.priorityBalance) },
	{
		key: 'interventions',
		present: (p) =>
			nonEmpty(p.recommendations.recommendedInterventions) ||
			nonEmpty(p.recommendations.notRecommendedInterventions)
	},
	{
		key: 'cprRecommendation',
		present: (p) =>
			p.cpr.cprRecommendation === 'attempt' || p.cpr.cprRecommendation === 'do-not-attempt'
	},
	{
		key: 'ceilings',
		present: (p) =>
			nonEmpty(p.ceilings.hospitalTransfer) ||
			nonEmpty(p.ceilings.criticalCareAdmission) ||
			nonEmpty(p.ceilings.treatmentCeilings)
	},
	{ key: 'hasCapacity', present: (p) => nonEmpty(p.capacity.hasCapacity) },
	{
		key: 'capacityProxy',
		present: (p) =>
			nonEmpty(p.capacity.capacityAssessment) &&
			nonEmpty(p.capacity.involvement) &&
			p.capacity.involvement !== 'person',
		applies: (p) => p.capacity.hasCapacity === 'no'
	},
	{ key: 'clinicianName', present: (p) => nonEmpty(p.signOff.clinicianName) },
	{ key: 'clinicianRole', present: (p) => nonEmpty(p.signOff.clinicianRole) },
	{ key: 'signature', present: (p) => nonEmpty(p.signOff.signature) },
	{ key: 'signedAt', present: (p) => nonEmpty(p.signOff.signedAt) }
];

export type { AssessmentData };
