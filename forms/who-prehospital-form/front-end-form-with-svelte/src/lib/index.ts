// Public exports for the $lib alias.
export * from './engine/types';
export { prehospitalRules } from './engine/prehospital-rules';
export { validatePrehospital } from './engine/prehospital-validator';
export { detectFlaggedIssues } from './engine/flagged-issues';
export {
	gcsTotal,
	hasAirwayIntervention,
	hasBreathingIntervention,
	hasIvAccessOrFluids,
	hasAnyHighRiskSign,
	hasNumber,
	hasText,
	isInjury,
	isYesNoAnswered,
	isYesNoUnknownAnswered,
	priorityColor,
	priorityLabel,
	sectionLabel
} from './engine/utils';
export {
	assessment,
	createDefaultAssessment,
	emptyReassessment
} from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
