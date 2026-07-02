import type { CssrsRule } from './types';

/**
 * Declarative C-SSRS classification rules (the audit trail of what fired).
 *
 * C-SSRS is NOT a summed score. These rows describe the individual ideation
 * items (Q1-Q5, ordinal levels 1-5), the categorical suicidal-behaviour items,
 * and the lethality thresholds. The grader (`cssrs-grader.ts`) evaluates them to
 * derive the highest affirmative ideation level (0-5), whether suicidal
 * behaviour is present and recent, and the resulting Low / Moderate / High risk
 * tier. Rows mirror the `columbia_suicide_severity_rating_scale_grade_rule` SQL
 * table (rule_id, criterion, level, category, description).
 */
export const cssrsRules: CssrsRule[] = [
	// ─── SUICIDAL IDEATION (Q1-Q5; highest affirmative sets the level) ───
	{
		id: 'R-IDEATION-01',
		criterion: 'ideation',
		level: 1,
		category: 'suicidal-ideation',
		description: 'Level 1 — wish to be dead (passive)',
		evaluate: (d) => d.ideation.wishToBeDead === 'yes'
	},
	{
		id: 'R-IDEATION-02',
		criterion: 'ideation',
		level: 2,
		category: 'suicidal-ideation',
		description:
			'Level 2 — non-specific active suicidal thoughts (no method, intent, or plan)',
		evaluate: (d) => d.ideation.nonSpecificActiveThoughts === 'yes'
	},
	{
		id: 'R-IDEATION-03',
		criterion: 'ideation',
		level: 3,
		category: 'suicidal-ideation',
		description:
			'Level 3 — active ideation with any methods, no specific plan or intent',
		evaluate: (d) => d.ideation.activeIdeationMethods === 'yes'
	},
	{
		id: 'R-IDEATION-04',
		criterion: 'ideation',
		level: 4,
		category: 'suicidal-ideation',
		description:
			'Level 4 — active ideation with some intent to act, without a fully worked-out plan',
		evaluate: (d) => d.ideation.activeIdeationIntent === 'yes'
	},
	{
		id: 'R-IDEATION-05',
		criterion: 'ideation',
		level: 5,
		category: 'suicidal-ideation',
		description: 'Level 5 — active ideation with a specific plan and intent to act',
		evaluate: (d) => d.ideation.activeIdeationPlan === 'yes'
	},

	// ─── SUICIDAL BEHAVIOUR (each counts as suicidal behaviour) ──────────
	{
		id: 'R-BEHAVIOUR-ACTUAL-ATTEMPT',
		criterion: 'behaviour',
		level: 0,
		category: 'suicidal-behaviour',
		description:
			'Actual attempt — a potentially self-injurious act with at least some intent to die',
		evaluate: (d) => d.behaviour.actualAttempt === 'yes'
	},
	{
		id: 'R-BEHAVIOUR-INTERRUPTED-ATTEMPT',
		criterion: 'behaviour',
		level: 0,
		category: 'suicidal-behaviour',
		description:
			'Interrupted attempt — stopped by an outside circumstance before self-harm begins',
		evaluate: (d) => d.behaviour.interruptedAttempt === 'yes'
	},
	{
		id: 'R-BEHAVIOUR-ABORTED-ATTEMPT',
		criterion: 'behaviour',
		level: 0,
		category: 'suicidal-behaviour',
		description:
			'Aborted / self-interrupted attempt — the person stops before beginning the act',
		evaluate: (d) => d.behaviour.abortedAttempt === 'yes'
	},
	{
		id: 'R-BEHAVIOUR-PREPARATORY-ACTS',
		criterion: 'behaviour',
		level: 0,
		category: 'suicidal-behaviour',
		description:
			'Preparatory acts or behaviour — steps taken to prepare, e.g. acquiring means or writing a note',
		evaluate: (d) => d.behaviour.preparatoryActs === 'yes'
	},
	{
		id: 'R-BEHAVIOUR-NON-SUICIDAL-SELF-INJURY',
		criterion: 'behaviour',
		level: 0,
		category: 'non-suicidal-self-injury',
		description:
			'Non-suicidal self-injury (NSSI) — self-injury without intent to die; tracked separately',
		evaluate: (d) => d.behaviour.nonSuicidalSelfInjury === 'yes'
	},

	// ─── LETHALITY (of the most recent actual attempt) ───────────────────
	{
		id: 'R-LETHALITY-ACTUAL-HIGH',
		criterion: 'lethality',
		level: 0,
		category: 'lethality',
		description:
			'High actual lethality — medical damage of the most recent attempt is 3 or greater',
		evaluate: (d) =>
			d.lethality.actualLethality !== null && d.lethality.actualLethality >= 3
	},
	{
		id: 'R-LETHALITY-POTENTIAL-HIGH',
		criterion: 'lethality',
		level: 0,
		category: 'lethality',
		description:
			'High potential lethality — potential lethality is 2 (likely to have caused death)',
		evaluate: (d) =>
			d.lethality.potentialLethality !== null && d.lethality.potentialLethality === 2
	}
];
