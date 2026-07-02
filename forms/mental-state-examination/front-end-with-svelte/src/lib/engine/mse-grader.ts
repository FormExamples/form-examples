import type {
	AssessmentData,
	CompletenessStatus,
	DomainStatus,
	FiredRule,
	FlaggedIssue,
	GradingResult,
	RiskLevel
} from './types';
import { domainRules } from './mse-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate each domain-documentation rule against the record, returning the
 * seven per-domain documented flags (spec §4).
 */
export function computeDomainStatuses(data: AssessmentData): DomainStatus[] {
	return domainRules.map((rule) => ({
		domain: rule.domain,
		label: rule.label,
		documented: rule.satisfied(data) === true
	}));
}

/**
 * Derive the risk level from the priorities of the flags raised. Highest wins;
 * it is never a sum of points (spec §5).
 */
export function deriveRiskLevel(flags: FlaggedIssue[]): RiskLevel {
	if (flags.some((f) => f.priority === 'high')) return 'high';
	if (flags.some((f) => f.priority === 'moderate')) return 'moderate';
	if (flags.some((f) => f.priority === 'low')) return 'low';
	return 'none';
}

/**
 * Compute the completeness grade (no risk yet — risk needs the flags). Returns
 * the complete / partial status, the completeness percentage, the per-domain
 * statuses, the documented-domain count, and the fired-rule audit trail.
 */
export function calculateGrade(data: AssessmentData): {
	status: CompletenessStatus;
	completenessPercent: number;
	domainStatuses: DomainStatus[];
	documentedCount: number;
	firedRules: FiredRule[];
} {
	const domainStatuses = computeDomainStatuses(data);
	const total = domainStatuses.length; // 7
	const documentedCount = domainStatuses.filter((d) => d.documented).length;
	const completenessPercent = total > 0 ? Math.round((100 * documentedCount) / total) : 0;
	const status: CompletenessStatus = documentedCount === total ? 'complete' : 'partial';

	// Audit trail: one row per documented domain, mirroring grade_rule.
	const firedRules: FiredRule[] = [];
	for (let idx = 0; idx < domainRules.length; idx++) {
		const rule = domainRules[idx];
		if (domainStatuses[idx].documented) {
			firedRules.push({
				id: rule.id,
				domain: rule.domain,
				category: rule.category,
				description: rule.description
			});
		}
	}
	firedRules.push({
		id: 'R-COMPLETENESS-01',
		domain: 'completeness',
		category: 'completeness',
		description:
			status === 'complete'
				? `All ${total} ASEPTIC domains documented — examination complete (100%)`
				: `${documentedCount} of ${total} ASEPTIC domains documented — examination partial (${completenessPercent}%)`
	});

	return { status, completenessPercent, domainStatuses, documentedCount, firedRules };
}

/**
 * Pure function: compute the full MSE completeness + risk result for the
 * supplied assessment data. This is a DOCUMENTATION / COMPLETENESS instrument —
 * there is NO numeric total. It emits:
 *
 *   status              = complete | partial   (all seven domains documented?)
 *   completenessPercent = round(100 * documentedDomains / 7)   (0..100)
 *   riskLevel           = none | low | moderate | high — the highest priority
 *                         among the safety flags raised (NOT a sum)
 *
 * This is the canonical engine entry point (spec §6).
 */
export function calculateMseGrade(data: AssessmentData): GradingResult {
	const grade = calculateGrade(data);
	const flags = detectFlaggedIssues(data, grade.status);
	const riskLevel = deriveRiskLevel(flags);

	const firedRules = grade.firedRules.slice();
	firedRules.push({
		id: 'R-RISK-01',
		domain: 'risk',
		category: 'risk',
		description:
			riskLevel === 'none'
				? 'No safety flags raised — risk level none'
				: `Risk level ${riskLevel} — driven by the highest-priority safety flag raised`
	});

	return {
		status: grade.status,
		riskLevel,
		completenessPercent: grade.completenessPercent,
		domainStatuses: grade.domainStatuses,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
