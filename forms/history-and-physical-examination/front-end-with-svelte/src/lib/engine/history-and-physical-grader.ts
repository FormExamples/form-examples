import type {
	AssessmentData,
	ClerkingRecord,
	CompletenessStatus,
	ComponentStatus,
	FiredRule,
	GradingResult
} from './types';
import { componentRules, flatten, nonEmpty, allergyDocumented, coreExamAddressed } from './history-and-physical-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** allergies undocumented — a blocking condition. */
export function allergiesUndocumented(r: ClerkingRecord): boolean {
	return !allergyDocumented(r);
}

/** no impression and no plan — a blocking condition. */
export function noImpressionOrPlan(r: ClerkingRecord): boolean {
	return !nonEmpty(r.impression) && !nonEmpty(r.managementPlan);
}

/**
 * Evaluate the ten required-component rules against the record, returning one
 * per-component satisfied flag (spec §4).
 */
export function computeComponentStatuses(r: ClerkingRecord): ComponentStatus[] {
	return componentRules.map((rule) => {
		let ok = false;
		try {
			ok = rule.evaluate(r) === true;
		} catch {
			ok = false;
		}
		return { component: rule.component, label: rule.label, satisfied: ok };
	});
}

/**
 * Pure function: compute the full H&P completeness result for the supplied
 * clerking data. This is a DOCUMENTATION / COMPLETENESS instrument — there is NO
 * numeric total. It emits:
 *
 *   status              = complete | partial | incomplete
 *   completenessPercent = round(100 * satisfiedComponents / 10)   (0..100)
 *
 * Two blocking flags (allergies undocumented; no impression AND no plan) force
 * `incomplete`. `complete` requires all ten components and no blocking flag;
 * otherwise `partial` when the core clinical narrative is present, else
 * `incomplete`. This is the canonical engine entry point (spec §6).
 */
export function calculateHistoryAndPhysicalGrade(data: AssessmentData): GradingResult {
	const r = flatten(data);
	const componentStatuses = computeComponentStatuses(r);
	const total = componentStatuses.length; // 10
	const satisfiedComponents = componentStatuses.filter((c) => c.satisfied).map((c) => c.component);
	const missingComponents = componentStatuses.filter((c) => !c.satisfied).map((c) => c.component);
	const completenessPercent = Math.round((satisfiedComponents.length / total) * 100);

	const blocking = allergiesUndocumented(r) || noImpressionOrPlan(r);

	const coreNarrative =
		nonEmpty(r.presentingComplaint) &&
		nonEmpty(r.historyOfPresentingComplaint) &&
		coreExamAddressed(r) &&
		(nonEmpty(r.impression) || nonEmpty(r.managementPlan));

	let status: CompletenessStatus;
	if (blocking || !coreNarrative) {
		status = 'incomplete';
	} else if (satisfiedComponents.length === total) {
		status = 'complete';
	} else {
		status = 'partial';
	}

	// Audit trail: one row per satisfied component, then the derived status.
	const firedRules: FiredRule[] = [];
	for (let idx = 0; idx < componentRules.length; idx++) {
		const rule = componentRules[idx];
		if (componentStatuses[idx].satisfied) {
			firedRules.push({
				id: rule.id,
				component: rule.component,
				section: rule.section,
				category: rule.category,
				description: rule.description
			});
		}
	}
	firedRules.push({
		id: 'R-COMPLETENESS-STATUS-01',
		component: 'completeness-status',
		section: 'completeness',
		category: 'derived-status',
		description:
			`Status ${status} — ${satisfiedComponents.length} of ${total} required components documented (${completenessPercent}%)` +
			(blocking ? '; a blocking flag forced incomplete' : '')
	});

	const flags = detectFlaggedIssues(r);

	return {
		status,
		completenessPercent,
		componentStatuses,
		satisfiedComponents,
		missingComponents,
		firedRules,
		flags,
		blocking,
		timestamp: new Date().toISOString()
	};
}
