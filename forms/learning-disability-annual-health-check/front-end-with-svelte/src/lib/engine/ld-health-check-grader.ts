import type {
	AssessmentData,
	CompletenessStatus,
	ComponentStatus,
	FiredRule,
	GradingResult
} from './types';
import { componentRules } from './ld-health-check-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate each required-component rule against the record, returning the
 * per-component completed flags (spec §4).
 */
export function computeComponentStatuses(data: AssessmentData): ComponentStatus[] {
	return componentRules.map((rule) => ({
		id: rule.component,
		group: rule.group,
		label: rule.label,
		completed: rule.completed(data) === true
	}));
}

/**
 * Is the Health Action Plan complete — produced AND shared (spec §4)?
 */
export function isHealthActionPlanComplete(data: AssessmentData): boolean {
	return (
		data.plan.healthActionPlanProduced === 'yes' && data.plan.healthActionPlanShared === 'yes'
	);
}

/**
 * Compute the completeness grade (no flags yet — the incomplete flag needs the
 * status). Returns the complete / incomplete status, the completeness
 * percentage, the per-component statuses, the completed-component count, whether
 * the Health Action Plan is complete, and the fired-rule audit trail.
 *
 * Classification (spec §4): `status` is `complete` only when EVERY required
 * component is completed AND the Health Action Plan was produced and shared;
 * otherwise `incomplete`. The Health Action Plan is a required output — without
 * it the status is always `incomplete` even if every component was completed.
 */
export function calculateGrade(data: AssessmentData): {
	status: CompletenessStatus;
	completenessPercent: number;
	healthActionPlanComplete: boolean;
	componentStatuses: ComponentStatus[];
	completedCount: number;
	firedRules: FiredRule[];
} {
	const componentStatuses = computeComponentStatuses(data);
	const total = componentStatuses.length; // 18
	const completedCount = componentStatuses.filter((c) => c.completed).length;
	const completenessPercent = total > 0 ? Math.round((100 * completedCount) / total) : 0;

	const healthActionPlanComplete = isHealthActionPlanComplete(data);

	const status: CompletenessStatus =
		completedCount === total && healthActionPlanComplete ? 'complete' : 'incomplete';

	// Audit trail: one row per completed component, mirroring grade_rule.
	const firedRules: FiredRule[] = [];
	for (let i = 0; i < componentRules.length; i++) {
		const rule = componentRules[i];
		if (componentStatuses[i].completed) {
			firedRules.push({
				id: rule.id,
				component: rule.component,
				category: rule.category,
				description: rule.description
			});
		}
	}
	firedRules.push({
		id: 'R-COMPLETENESS-01',
		component: 'completeness',
		category: 'completeness',
		description:
			completedCount === total
				? `All ${total} required components completed (${completenessPercent}%)`
				: `${completedCount} of ${total} required components completed (${completenessPercent}%)`
	});
	firedRules.push({
		id: 'R-HEALTH-ACTION-PLAN-01',
		component: 'health-action-plan',
		category: 'health-action-plan',
		description: healthActionPlanComplete
			? 'Health Action Plan produced and shared with the person'
			: 'Health Action Plan not produced and shared — required for a complete check'
	});

	return {
		status,
		completenessPercent,
		healthActionPlanComplete,
		componentStatuses,
		completedCount,
		firedRules
	};
}

/**
 * Pure function: compute the full annual-health-check completeness result for
 * the supplied assessment data. This is a DOCUMENTATION / COMPLETENESS
 * instrument — there is NO numeric score. It emits:
 *
 *   status                   = complete | incomplete
 *   completenessPercent      = round(100 * completedComponents / 18)   (0..100)
 *   healthActionPlanComplete = Health Action Plan produced AND shared
 *   componentStatuses[]      = per-component completed flags
 *   firedRules[]             = audit trail (completed components + summary rows)
 *   flags[]                  = the clinical flags (STOMP, HAP, dysphagia, …)
 *
 * This is the canonical engine entry point (spec §6).
 */
export function calculateHealthCheckGrade(data: AssessmentData): GradingResult {
	const grade = calculateGrade(data);
	const flags = detectFlaggedIssues(data, grade.status);

	return {
		status: grade.status,
		completenessPercent: grade.completenessPercent,
		healthActionPlanComplete: grade.healthActionPlanComplete,
		componentStatuses: grade.componentStatuses,
		firedRules: grade.firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
