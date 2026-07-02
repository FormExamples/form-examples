import type {
	AssessmentData,
	ComponentStatus,
	ControlStatus,
	FiredRule,
	GradingResult,
	ReviewStatus
} from './types';
import { COMPONENTS, classifyControl, computeStage, selectTarget } from './hypertension-review-rules';
import { detectFlaggedIssues } from './flagged-issues';
import { controlStatusLabel, hypertensionStageLabel } from './utils';

// Hypertension-review control-classification and completeness grader. Pure
// functions: take an `AssessmentData` object and derive the documentation
// outputs (spec §4). This is NOT a numeric severity score. It emits:
//
//   controlStatus       = { controlClass, bpTarget, primarySource, hypertensionStage }
//   reviewStatus        = complete | partial | incomplete
//   componentStatuses[] = per-component documented flag (review completeness)
//   firedRules[]        = audit trail: target, control, stage, completeness rows
//   flags[]             = the flags (from flagged-issues.ts)

/** Evaluate each review component's documentation status. */
export function computeComponentStatuses(data: AssessmentData): ComponentStatus[] {
	return COMPONENTS.map((c) => ({
		component: c.component,
		label: c.label,
		documented: c.satisfied(data) === true
	}));
}

/**
 * Grade review completeness (spec §4.4). Blood pressure is the gate: with no BP
 * the review is incomplete; otherwise it is complete when every core secondary
 * component is documented, else partial.
 */
export function gradeReviewStatus(
	_data: AssessmentData,
	componentStatuses: ComponentStatus[]
): ReviewStatus {
	const bp = componentStatuses.find((c) => c.component === 'blood-pressure');
	const hasBp = !!(bp && bp.documented);
	if (!hasBp) return 'incomplete';
	const secondary = componentStatuses.filter((c) => c.component !== 'blood-pressure');
	const coreComplete = secondary.every((c) => c.documented);
	return coreComplete ? 'complete' : 'partial';
}

/**
 * Compute the full control status: tightest target, control class, primary
 * source, and hypertension stage.
 */
export function computeControlStatus(data: AssessmentData): ControlStatus {
	const bpTarget = selectTarget(data);
	const { controlClass, primarySource } = classifyControl(data, bpTarget);
	const hypertensionStage = computeStage(data);
	return { controlClass, bpTarget, primarySource, hypertensionStage };
}

/**
 * Full review: control status + completeness + flags. Pure; no I/O. This is the
 * canonical engine entry point (spec §6).
 */
export function review(data: AssessmentData): GradingResult {
	const componentStatuses = computeComponentStatuses(data);
	const reviewStatus = gradeReviewStatus(data, componentStatuses);
	const controlStatus = computeControlStatus(data);

	const flags = detectFlaggedIssues(data, {
		controlClass: controlStatus.controlClass,
		reviewStatus
	});

	const documented = componentStatuses.filter((c) => c.documented).length;
	const total = componentStatuses.length;

	const firedRules: FiredRule[] = [];

	firedRules.push({
		id: 'R-TARGET-01',
		category: 'target',
		description:
			`Target group: ${controlStatus.bpTarget.group} — clinic ` +
			`${controlStatus.bpTarget.clinic.systolic}/${controlStatus.bpTarget.clinic.diastolic}, ` +
			`home ${controlStatus.bpTarget.home.systolic}/${controlStatus.bpTarget.home.diastolic} mmHg`
	});

	firedRules.push({
		id: 'R-CONTROL-01',
		category: 'control',
		description:
			controlStatus.primarySource === 'none'
				? 'No blood pressure recorded — control not classified'
				: `Control classified ${controlStatusLabel(controlStatus.controlClass)} ` +
					`against the ${controlStatus.primarySource} reading`
	});

	firedRules.push({
		id: 'R-STAGE-01',
		category: 'stage',
		description: `Hypertension stage: ${hypertensionStageLabel(controlStatus.hypertensionStage)}`
	});

	firedRules.push({
		id: 'R-COMPLETENESS-01',
		category: 'completeness',
		description:
			reviewStatus === 'complete'
				? `All ${total} review components documented — review complete`
				: reviewStatus === 'incomplete'
					? 'No blood-pressure reading recorded — review incomplete'
					: `${documented} of ${total} review components documented — review partial`
	});

	return {
		controlStatus,
		reviewStatus,
		componentStatuses,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
