// Public exports for the $lib alias.
export * from './engine/types';
export { evaluateFp92a } from './engine/fp92a-validator';
export { fp92aRules } from './engine/fp92a-rules';
export { detectAdditionalFlags } from './engine/flagged-issues';
export {
	addYears,
	ageInYears,
	conditionLabel,
	daysBetween,
	isFilled,
	looksLikeNhsNumber,
	priorityColor,
	priorityLabel,
	priorityOrder,
	todayIso
} from './engine/utils';
export { application, createDefaultApplication } from './stores/application.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
