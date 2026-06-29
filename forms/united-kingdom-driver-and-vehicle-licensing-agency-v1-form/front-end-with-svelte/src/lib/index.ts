// Public exports for the $lib alias.
export * from './engine/types';
export { v1Rules } from './engine/v1-rules';
export { validateV1 } from './engine/v1-validator';
export { detectFlaggedIssues } from './engine/flagged-issues';
export {
	calculateAge,
	contactPreferenceLabel,
	countVisionConditionsDeclared,
	eyesightStandardLabel,
	formatDateUk,
	meetsEyesightStandard,
	statusColor,
	statusLabel,
	isBlepharospasmBranchActive,
	isDoubleVisionBranchActive,
	isGlaucomaBranchActive,
	isLaserTreatmentBranchActive,
	isMonocularBranchActive,
	isNightBlindnessBranchActive,
	isOtherVisionBranchActive,
	isRecentContactBranchActive,
	isRetinitisPigmentosaBranchActive,
	isVisualFieldBranchActive,
	isVisualFieldCauseBranchActive,
	monocularAdaptationLabel,
	monocularDurationLabel,
	priorityColor,
	priorityLabel,
	severityColor,
	severityLabel,
	visualFieldCauseLabel,
	whichEyeLabel,
	whichEyesLabel
} from './engine/utils';
export { assessment, createDefaultAssessment } from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
