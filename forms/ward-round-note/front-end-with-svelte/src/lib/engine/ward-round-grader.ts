// Ward-round-note documentation-completeness grader. Pure functions: take an
// `AssessmentData` object and derive the documentation outputs (spec §4).
// This is NOT a numeric clinical score. It emits:
//
//   status              = complete | partial | incomplete
//   completenessPercent = round(100 * documentedRequired / 8) (0..100)
//   componentStatuses[] = per-component presence (all ten components)
//   presence            = the per-component `documented` booleans
//   documentedComponents = names of every documented component (required +
//                          recommended)
//   firedRules[]        = audit trail: each documented component, plus a
//                         completeness row (mirrors ward_round_note_grade_rule)
//   flags[]             = the safety flags (from flagged-issues.ts)
//
// Classification (spec §4):
//   documentedRequired == 8                        -> 'complete'
//   header && plan && documentedRequired >= 4      -> 'partial'
//   otherwise                                      -> 'incomplete'

import type {
	AssessmentData,
	ComponentPresence,
	ComponentStatus,
	CompletenessStatus,
	FiredRule,
	GradingResult,
	RuleComponent
} from './types';
import {
	componentPresence,
	recommendedComponents,
	requiredComponents
} from './ward-round-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** The ten review components, in order, with their required/recommended class. */
export const COMPONENTS: { component: string; label: string; required: boolean }[] = [
	{ component: 'header', label: 'Review header', required: true },
	{ component: 'problems', label: 'Problems and progress', required: true },
	{ component: 'examination', label: 'Examination and NEWS2', required: true },
	{ component: 'investigations', label: 'Investigations reviewed', required: true },
	{ component: 'vte', label: 'VTE assessment', required: true },
	{ component: 'medication', label: 'Medication changes', required: true },
	{ component: 'plan', label: 'Plan and jobs', required: true },
	{ component: 'escalation', label: 'Escalation status', required: true },
	{ component: 'overnight-events', label: 'Overnight events', required: false },
	{ component: 'estimated-discharge', label: 'Estimated discharge', required: false }
];

/** Build the per-component presence rows for the report (all ten components). */
export function componentStatuses(presence: ComponentPresence): ComponentStatus[] {
	const map: Record<string, boolean> = {
		header: presence.header,
		problems: presence.problems,
		examination: presence.examination,
		investigations: presence.investigations,
		vte: presence.vte,
		medication: presence.medication,
		plan: presence.plan,
		escalation: presence.escalation,
		'overnight-events': presence.overnightEvents,
		'estimated-discharge': presence.estimatedDischarge
	};
	return COMPONENTS.map((c) => ({
		component: c.component,
		label: c.label,
		required: c.required,
		present: !!map[c.component]
	}));
}

/** Compute the completeness grade (no flags yet). */
export function calculateGrade(data: AssessmentData): {
	presence: ComponentPresence;
	completenessPercent: number;
	required: RuleComponent[];
	recommended: RuleComponent[];
	documentedRequired: number;
	totalRequired: number;
	firedRules: FiredRule[];
} {
	const presence = componentPresence(data);
	const required = requiredComponents(data);
	const recommended = recommendedComponents(data);
	const totalRequired = required.length; // 8
	const documentedRequired = required.filter((c) => c.present).length;
	const completenessPercent =
		totalRequired > 0 ? Math.round((100 * documentedRequired) / totalRequired) : 0;

	// Audit trail: one row per DOCUMENTED component (required + recommended),
	// mirroring ward_round_note_grade_rule.
	const firedRules: FiredRule[] = [];
	for (const c of required.concat(recommended)) {
		if (c.present) {
			firedRules.push({
				id: c.id,
				component: c.component,
				category: c.category,
				description: c.description
			});
		}
	}

	return {
		presence,
		completenessPercent,
		required,
		recommended,
		documentedRequired,
		totalRequired,
		firedRules
	};
}

/**
 * Full grade: completeness + safety flags + derived status. Pure; no I/O.
 * This is the canonical engine entry point (spec §6).
 */
export function calculateWardRoundGrade(data: AssessmentData): GradingResult {
	const grade = calculateGrade(data);
	const { presence, completenessPercent, documentedRequired, totalRequired } = grade;

	let status: CompletenessStatus;
	if (documentedRequired === totalRequired) {
		status = 'complete';
	} else if (presence.header && presence.plan && documentedRequired >= 4) {
		status = 'partial';
	} else {
		status = 'incomplete';
	}

	const flags = detectFlaggedIssues(data, { documentedRequired, totalRequired });

	const statuses = componentStatuses(presence);
	const documentedComponents = statuses.filter((s) => s.present).map((s) => s.component);

	const firedRules = grade.firedRules.slice();
	firedRules.push({
		id: 'R-COMPLETENESS-01',
		component: 'completeness',
		category: 'completeness',
		description:
			status === 'complete'
				? `All ${totalRequired} required components documented — entry complete (100%)`
				: `${documentedRequired} of ${totalRequired} required components documented — entry ${status} (${completenessPercent}%)`
	});

	return {
		status,
		completenessPercent,
		componentStatuses: statuses,
		presence,
		documentedComponents,
		documentedRequired,
		totalRequired,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
