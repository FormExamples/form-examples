// Flagged-issue detection for the Employee Satisfaction Survey.
//
// Flags surface notable issues to HR / engagement reviewers AFTER the
// composite and per-domain scores have been computed by grader.ts.
//
// Priority ladder:
//
//   high   - composite category 'very-poor', OR ≥2 graded domains at
//            'very-poor', OR retention intent "leaving within 6 months",
//            OR an eNPS detractor (0-6).
//   medium - composite category 'poor', OR one graded domain at 'poor',
//            OR explicit dissatisfaction with management.
//   low    - free-text suggestion-box ideas, or free-text that may identify
//            the respondent and break anonymity.

import type {
	AssessmentData,
	AdditionalFlag,
	DomainScores,
	SatisfactionCategory,
	ENpsResult,
	GradedDomainKey
} from './types';
import { domainLabel } from './utils';

/** The subset of grading output the flag rules need. */
export interface FlagGradingInput {
	compositeScore: number | null;
	category: SatisfactionCategory;
	domainScores: DomainScores;
	eNPS: ENpsResult;
	answeredCount: number;
}

const DOMAIN_KEYS: GradedDomainKey[] = [
	'workload',
	'management',
	'growth',
	'compensation',
	'culture',
	'environment',
	'recognition',
	'overall'
];

// Patterns suggesting the employee accidentally entered identifying details.
// Anonymity is the design intent of this survey, so reviewers should be
// alerted to redact before sharing.
const IDENTIFYING_PATTERNS: RegExp[] = [
	/\b(my name is|i am|i'm)\s+[A-Z][a-z]+/,
	/\b[A-Z][a-z]+\s+[A-Z][a-z]+/,
	/\bemployee\s*(id|number|no\.?)\s*[:#]?\s*\w+/i,
	/\bstaff\s*(id|number|no\.?)\s*[:#]?\s*\w+/i,
	/\bni\s*number\b/i,
	/\b\d{3}[-\s]?\d{3,}\b/,
	/[\w.+-]+@[\w-]+\.[\w.-]+/
];

/** Detect prioritised flagged issues from the data and graded result. */
export function detectAdditionalFlags(
	data: AssessmentData,
	grading: FlagGradingInput
): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];
	const domains = grading.domainScores || ({} as DomainScores);

	// ─── Composite-level ─────────────────────────────────────────
	if (grading.category === 'very-poor') {
		flags.push({
			id: 'FLAG-COMPOSITE-VP',
			category: 'Overall',
			message: `Composite satisfaction score ${grading.compositeScore ?? '?'}/100 is in the very-poor band. Urgent attention recommended.`,
			priority: 'high'
		});
	} else if (grading.category === 'poor') {
		flags.push({
			id: 'FLAG-COMPOSITE-POOR',
			category: 'Overall',
			message: `Composite satisfaction score ${grading.compositeScore ?? '?'}/100 is in the poor band. Significant improvement areas should be addressed.`,
			priority: 'medium'
		});
	}

	// ─── Per-domain roll-up ──────────────────────────────────────
	const veryPoorDomains: GradedDomainKey[] = [];
	const poorDomains: GradedDomainKey[] = [];

	for (const key of DOMAIN_KEYS) {
		const r = domains[key];
		if (!r) continue;
		if (r.category === 'very-poor') veryPoorDomains.push(key);
		else if (r.category === 'poor') poorDomains.push(key);
	}

	if (veryPoorDomains.length >= 2) {
		flags.push({
			id: 'FLAG-DOMAIN-VP-MULTI',
			category: 'Overall',
			message: `${veryPoorDomains.length} graded domains at very-poor (${veryPoorDomains.map((k) => domainLabel(k)).join(', ')}) — broad organisational issue.`,
			priority: 'high'
		});
	}

	for (const key of veryPoorDomains) {
		flags.push({
			id: `FLAG-DOMAIN-VP-${key}`,
			category: domainLabel(key),
			message: `${domainLabel(key)} at very-poor (${domains[key].score ?? '?'}/100). Immediate review recommended.`,
			priority: 'high'
		});
	}

	for (const key of poorDomains) {
		flags.push({
			id: `FLAG-DOMAIN-POOR-${key}`,
			category: domainLabel(key),
			message: `${domainLabel(key)} at poor (${domains[key].score ?? '?'}/100). Targeted improvement recommended.`,
			priority: 'medium'
		});
	}

	// ─── Management-specific dissatisfaction ─────────────────────
	if (data.management) {
		const mgKeys: (keyof AssessmentData['management'])[] = ['mg1', 'mg2', 'mg3', 'mg4', 'mg5'];
		const stronglyDisagreeMg = mgKeys.filter((k) => data.management[k] === 1);
		const mgCat = domains.management ? domains.management.category : '';
		const alreadyFlagged = mgCat === 'poor' || mgCat === 'very-poor';
		if (stronglyDisagreeMg.length > 0 && !alreadyFlagged) {
			flags.push({
				id: 'FLAG-MGMT-STRONG-DISAGREE',
				category: domainLabel('management'),
				message: `Strong disagreement on ${stronglyDisagreeMg.length} management item${stronglyDisagreeMg.length === 1 ? '' : 's'}. Review line-management quality and senior-leadership trust.`,
				priority: 'medium'
			});
		}
	}

	// ─── Retention intent ────────────────────────────────────────
	const retention = data.overall ? data.overall.retentionIntent : '';
	if (retention === 'leaving-within-6-months') {
		flags.push({
			id: 'FLAG-RETENTION-LEAVING',
			category: 'Retention',
			message:
				'Respondent is actively planning to leave within 6 months. Consider stay-interview / retention conversation if anonymity allows.',
			priority: 'high'
		});
	} else if (retention === 'probably-leave-12-months') {
		flags.push({
			id: 'FLAG-RETENTION-PROBABLY-LEAVE',
			category: 'Retention',
			message: 'Respondent will probably leave within 12 months. Investigate drivers in this segment.',
			priority: 'medium'
		});
	}

	// ─── eNPS ────────────────────────────────────────────────────
	const enpsScore = grading.eNPS ? grading.eNPS.score : null;
	if (enpsScore !== null && enpsScore !== undefined) {
		if (grading.eNPS.classification === 'detractor') {
			flags.push({
				id: 'FLAG-ENPS-DETRACTOR',
				category: 'eNPS',
				message: `eNPS recommend score ${enpsScore}/10 — respondent is a detractor.`,
				priority: 'high'
			});
		}
	}

	// ─── Free-text scanning (Step 10 comments) ───────────────────
	const suggestions = (data.overall?.suggestionsForImprovement || '').trim();
	const otherText = (data.overall?.otherComments || '').trim();
	const allText = [suggestions, otherText].join('\n');

	if (suggestions) {
		flags.push({
			id: 'FLAG-TEXT-SUGGESTION',
			category: 'Suggestion box',
			message: 'Respondent submitted improvement suggestions — route to the relevant team for triage.',
			priority: 'low'
		});
	}

	if (allText) {
		for (const pat of IDENTIFYING_PATTERNS) {
			if (pat.test(allText)) {
				flags.push({
					id: 'FLAG-TEXT-PII',
					category: 'Anonymity',
					message:
						'Open-text comment may contain identifying details (name, employee id, contact info). Anonymity could be compromised; reviewer should redact before sharing.',
					priority: 'low'
				});
				break;
			}
		}
	}

	// Sort: high > medium > low.
	const order: Record<AdditionalFlag['priority'], number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => order[a.priority] - order[b.priority]);

	return flags;
}
