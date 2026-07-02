import type {
	AssessmentData,
	ComponentStatus,
	FiredRule,
	GradingResult,
	ReviewStatus,
	SeizureControl
} from './types';
import { COMPONENTS, classifyControl, componentApplicable } from './epilepsy-review-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { seizureControlLabel } from './utils';

// Epilepsy-review seizure-control classification and completeness grader. Pure
// functions: take an `AssessmentData` object and derive the documentation
// outputs (spec §4). This is NOT a numeric severity score. It emits:
//
//   seizureControl      = seizure-free | controlled | uncontrolled (rules)
//   reviewStatus        = complete | partial | incomplete
//   completenessScore   = count of documented required (applicable) domains
//   componentStatuses[] = per-component documented flag (review completeness)
//   firedRules[]        = audit trail: control + completeness rows
//   flags[]             = the safety flags (from flagged-issues.ts)
//
// Completeness (spec §4.2):
//   seizure OR medication missing -> 'incomplete'
//   else all applicable domains documented -> 'complete'
//   else 'partial'

/** Evaluate each applicable review component's documentation status. */
export function computeComponentStatuses(data: AssessmentData): ComponentStatus[] {
	return COMPONENTS.filter((c) => componentApplicable(c, data)).map((c) => ({
		component: c.component,
		label: c.label,
		documented: c.satisfied(data) === true,
		gate: c.gate === true
	}));
}

/**
 * Grade review completeness (spec §4.2). Seizure and medication are the gates:
 * with either missing the review is incomplete; otherwise it is complete when
 * every applicable domain is documented, else partial.
 */
export function gradeReviewStatus(componentStatuses: ComponentStatus[]): ReviewStatus {
	const gatesMissing = componentStatuses.some((c) => c.gate && !c.documented);
	if (gatesMissing) return 'incomplete';
	const allDocumented = componentStatuses.every((c) => c.documented);
	return allDocumented ? 'complete' : 'partial';
}

/**
 * Full review: seizure-control class + completeness + safety flags. Pure; no
 * I/O. This is the canonical engine entry point (spec §6).
 */
export function review(data: AssessmentData): GradingResult {
	const componentStatuses = computeComponentStatuses(data);
	const reviewStatus = gradeReviewStatus(componentStatuses);
	const seizureControl: SeizureControl = classifyControl(data);
	const completenessScore = componentStatuses.filter((c) => c.documented).length;
	const total = componentStatuses.length;

	const flags = detectFlaggedIssues(data, { seizureControl, reviewStatus });

	const firedRules: FiredRule[] = [];

	firedRules.push({
		id: 'R-SEIZURE-CONTROL-01',
		section: 'seizure-control',
		category: 'control-classification',
		description: `Seizure control classified ${seizureControlLabel(seizureControl)}`
	});

	if (data.injuries.statusEpilepticus === 'yes') {
		firedRules.push({
			id: 'R-SEIZURE-CONTROL-STATUS-02',
			section: 'seizure-control',
			category: 'control-classification',
			description: 'Status epilepticus since last review — forces uncontrolled'
		});
	} else if (
		data.seizures.seizureFrequency === 'weekly' ||
		data.seizures.seizureFrequency === 'daily'
	) {
		firedRules.push({
			id: 'R-SEIZURE-CONTROL-FREQUENCY-02',
			section: 'seizure-control',
			category: 'control-classification',
			description: `Seizure frequency ${data.seizures.seizureFrequency} — forces uncontrolled`
		});
	} else if (data.seizures.seizureTrend === 'increasing') {
		firedRules.push({
			id: 'R-SEIZURE-CONTROL-TREND-02',
			section: 'seizure-control',
			category: 'control-classification',
			description: 'Increasing seizure trend — forces uncontrolled'
		});
	}

	firedRules.push({
		id: 'R-COMPLETENESS-01',
		section: 'completeness',
		category: 'required-domain',
		description:
			reviewStatus === 'complete'
				? `All ${total} required review domains documented — review complete`
				: reviewStatus === 'incomplete'
					? 'A core domain (seizure or medication) is missing — review incomplete'
					: `${completenessScore} of ${total} required review domains documented — review partial`
	});

	return {
		seizureControl,
		reviewStatus,
		completenessScore,
		componentStatuses,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
