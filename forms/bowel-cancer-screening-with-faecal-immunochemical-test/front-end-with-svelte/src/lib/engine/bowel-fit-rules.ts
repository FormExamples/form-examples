import type { FiredRule } from './types';

/**
 * Declarative bowel-cancer-screening FIT constants and rules.
 *
 * Unlike an additive score, the FIT outcome is a *priority-ordered
 * classification*: the engine (see `bowel-fit-grader.ts`) tests kit return, then
 * sample adequacy, then the measured faecal haemoglobin against the applied
 * threshold, and stops at the first match. The rows below describe the branches
 * for the audit trail and mirror the `bowel_cancer_screening_fit_grade_rule` SQL
 * table (rule_id, instrument, band, category, description). The threshold itself
 * is a per-record field (default 120 µg Hb/g screening; 10 yields NICE DG56
 * symptomatic behaviour), so the classification rules read it at evaluation time
 * rather than hard-coding a constant.
 */

/** Default programme (screening) threshold in µg Hb/g. */
export const DEFAULT_THRESHOLD = 120;

/** Sample-adequacy values that are not adequate and therefore require a repeat kit. */
export const INADEQUATE_SAMPLE: string[] = ['spoilt', 'insufficient', 'expired'];

/** A branch key in the priority-ordered classification. */
export type BranchKey =
	| 'non-return'
	| 'spoilt'
	| 'positive'
	| 'negative'
	| 'incomplete'
	| 'symptomatic';

/**
 * Audit-row descriptors for each classification branch. These are informational
 * templates keyed by branch; the grader selects the row that matches the reached
 * branch and records it in the fired-rules audit.
 */
export const classificationRules: Record<BranchKey, FiredRule> = {
	'non-return': {
		id: 'R-RETURN-NOT-RETURNED-01',
		instrument: 'return',
		band: 'unknown',
		category: 'kit-return',
		description:
			'Kit not returned — no sample to classify; reissue kit and remind participant'
	},
	spoilt: {
		id: 'R-ADEQUACY-INADEQUATE-01',
		instrument: 'adequacy',
		band: 'spoilt',
		category: 'sample-adequacy',
		description:
			'Sample not adequate (spoilt / insufficient / expired) — repeat kit required'
	},
	positive: {
		id: 'R-CLASSIFY-POSITIVE-01',
		instrument: 'classification',
		band: 'positive',
		category: 'threshold',
		description:
			'Faecal haemoglobin at or above the programme threshold — positive; refer for colonoscopy'
	},
	negative: {
		id: 'R-CLASSIFY-NEGATIVE-01',
		instrument: 'classification',
		band: 'negative',
		category: 'threshold',
		description:
			'Faecal haemoglobin below the programme threshold — negative; routine two-yearly recall'
	},
	incomplete: {
		id: 'R-CLASSIFY-INCOMPLETE-01',
		instrument: 'classification',
		band: 'unknown',
		category: 'missing-input',
		description:
			'Kit returned and adequate but no faecal haemoglobin value — cannot classify; obtain the assay result'
	},
	symptomatic: {
		id: 'R-SYMPTOMATIC-PATHWAY-01',
		instrument: 'symptomatic',
		band: 'unknown',
		category: 'symptomatic',
		description:
			'Red-flag symptoms reported — route to the urgent suspected-cancer pathway independently of the FIT result'
	}
};
