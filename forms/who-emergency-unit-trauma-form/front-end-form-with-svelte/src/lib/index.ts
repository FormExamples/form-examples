// Public exports for the $lib alias.
export * from './engine/types';
export { euTraumaRules } from './engine/eu-trauma-rules';
export { validateEuTrauma } from './engine/eu-trauma-validator';
export { detectFlaggedIssues } from './engine/flagged-issues';
export {
	hasAirwayIntervention,
	hasAnyHighRiskSign,
	hasBreathingIntervention,
	hasCirculationIntervention,
	hasNumber,
	hasText,
	isYesNoAnswered,
	priorityColor,
	priorityLabel,
	sectionLabel
} from './engine/utils';
export { assessment, createDefaultAssessment } from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
