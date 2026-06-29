// Public exports for the $lib alias.
export * from './engine/types';
export { cfarRules } from './engine/cfar-rules';
export { validateCfar } from './engine/cfar-validator';
export { detectFlaggedIssues } from './engine/flagged-issues';
export { gradeCfar } from './engine/cfar-grader';
export {
	calculateAge,
	hasAnyAirwayIntervention,
	hasAnyBreathingIntervention,
	hasAnyCirculationIntervention,
	hasAnyDisabilityIntervention,
	hasAnyExposureIntervention,
	hasAnyMajorBleedingIntervention,
	hasNonTourniquetBleedingIntervention,
	hasText,
	isAssessmentAnswered,
	medicationTakenAnswered,
	priorityColor,
	priorityLabel,
	sectionLabel
} from './engine/utils';
export { assessment, createDefaultAssessment } from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
