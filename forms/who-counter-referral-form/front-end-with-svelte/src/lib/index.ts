// Public exports for the $lib alias.
export * from './engine/types';
export { counterReferralRules } from './engine/counter-referral-rules';
export { validateCounterReferral } from './engine/counter-referral-validator';
export { detectFlaggedIssues } from './engine/flagged-issues';
export {
	calculateAge,
	followUpTimeframeLabel,
	hasAnyStatusFlag,
	hasText,
	highestPriority,
	isYesNoAnswered,
	priorityColor,
	priorityLabel,
	sectionLabel
} from './engine/utils';
export { assessment, createDefaultAssessment } from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
