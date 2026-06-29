// Public exports for the $lib alias.
export * from './engine/types';
export { referralRules } from './engine/referral-rules';
export { validateReferral } from './engine/referral-validator';
export { detectFlaggedIssues } from './engine/flagged-issues';
export {
	anyPrecautionFlagged,
	calculateAge,
	hasNumber,
	hasText,
	isYesNoUnknownAnswered,
	priorityColor,
	priorityLabel,
	sectionLabel
} from './engine/utils';
export { assessment } from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
