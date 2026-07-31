// Inpatient-clinical-note grader: the canonical engine entry point.
//
// Runs both engines over an `AssessmentData` object and returns a
// `GradingResult`. Pure functions; no I/O.
//
// Completeness classification (spec §4.3), where R is the required set for this
// note's type and D the documented members of R:
//
//   |D| == |R|                                              -> 'complete'
//   header && impression && plan && |D| >= ceil(|R|/2)      -> 'partial'
//   otherwise                                               -> 'incomplete'
//
// The completeness status is deliberately NOT overridable: it is a mechanical
// property of the record, not a clinical judgement. Only the acuity band can be
// overridden, and only with a recorded reason.

import { evaluateAcuity } from './acuity';
import { detectFlaggedIssues } from './flagged-issues';
import { componentPresence, componentRules } from './note-rules';
import {
	ACUITY_ORDER,
	CRITICAL_COMPONENTS,
	type AcuityBand,
	type AssessmentData,
	type ComponentKey,
	type ComponentStatus,
	type CompletenessStatus,
	type FiredRule,
	type GradingResult
} from './types';

/**
 * Build the per-component presence rows for the report (all twelve components),
 * with `required` resolved for this note's type.
 */
export function componentStatuses(data: AssessmentData): ComponentStatus[] {
	return componentRules(data).map((c) => ({
		component: c.component,
		label: c.label,
		required: c.required,
		present: c.present
	}));
}

export interface CompletenessResult {
	presence: Record<ComponentKey, boolean>;
	completenessPercent: number;
	documentedRequired: number;
	totalRequired: number;
	firedRules: FiredRule[];
}

/** Compute the completeness half of the grade. */
export function calculateCompleteness(data: AssessmentData): CompletenessResult {
	const presence = componentPresence(data);
	const rules = componentRules(data);
	const required = rules.filter((c) => c.required);
	const totalRequired = required.length;
	const documentedRequired = required.filter((c) => c.present).length;
	const completenessPercent =
		totalRequired > 0 ? Math.round((100 * documentedRequired) / totalRequired) : 0;

	// Audit trail: one row per DOCUMENTED component, required or recommended,
	// mirroring inpatient_clinical_note_grade_rule.
	const firedRules: FiredRule[] = rules
		.filter((c) => c.present)
		.map((c) => ({
			id: c.id,
			engine: 'completeness' as const,
			component: c.component,
			band: '' as const,
			category: c.category,
			description: c.description
		}));

	return { presence, completenessPercent, documentedRequired, totalRequired, firedRules };
}

/** Full grade: completeness + acuity + safety flags. */
export function assess(data: AssessmentData): GradingResult {
	const completeness = calculateCompleteness(data);
	const { presence, completenessPercent, documentedRequired, totalRequired } = completeness;

	let status: CompletenessStatus;
	const criticalPresent = CRITICAL_COMPONENTS.every((k) => presence[k]);
	if (totalRequired > 0 && documentedRequired === totalRequired) {
		status = 'complete';
	} else if (criticalPresent && documentedRequired >= Math.ceil(totalRequired / 2)) {
		status = 'partial';
	} else {
		status = 'incomplete';
	}

	const acuity = evaluateAcuity(data);
	const computedAcuityBand = acuity.band;

	// The author may override the band, but only with a recorded reason: an
	// override without one is ignored rather than silently applied.
	const override = data.signOff.authorOverrideAcuity;
	const overrideReason = String(data.signOff.authorOverrideReason ?? '').trim();
	const acuityOverridden =
		!!override && (ACUITY_ORDER as string[]).includes(override) && overrideReason !== '';
	const acuityBand: AcuityBand = acuityOverridden
		? (override as AcuityBand)
		: computedAcuityBand;

	const flags = detectFlaggedIssues(data, { acuityBand, documentedRequired, totalRequired });

	const statuses = componentStatuses(data);
	const documentedComponents = statuses.filter((s) => s.present).map((s) => s.component);

	const firedRules = completeness.firedRules.concat(acuity.firedRules);
	firedRules.push({
		id: 'R-COMPLETENESS-01',
		engine: 'completeness',
		component: 'completeness',
		band: '',
		category: 'completeness',
		description:
			status === 'complete'
				? `All ${totalRequired} required components documented — entry complete (100%)`
				: `${documentedRequired} of ${totalRequired} required components documented — entry ${status} (${completenessPercent}%)`
	});

	if (acuityOverridden) {
		firedRules.push({
			id: 'A-AUTHOR-OVERRIDE',
			engine: 'acuity',
			component: 'acuity',
			band: acuityBand,
			category: 'override',
			description: `Author overrode the computed acuity band (${computedAcuityBand}) to ${acuityBand}: ${overrideReason}`
		});
	}

	return {
		status,
		completenessPercent,
		acuityBand,
		computedAcuityBand,
		acuityOverridden,
		news2Total: acuity.news2.effective,
		news2DerivedTotal: acuity.news2.derived,
		componentStatuses: statuses,
		documentedComponents,
		documentedRequired,
		totalRequired,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
