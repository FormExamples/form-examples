// Public exports for the $lib alias.
export * from './engine/types';
export { m1Rules } from './engine/m1-rules';
export { validateM1, countConditions } from './engine/m1-validator';
export { detectAdditionalFlags } from './engine/flagged-issues';
export {
	calculateAge,
	priorityColor,
	priorityLabel,
	priorityOrder,
	isFilled,
	looksLikePostcode
} from './engine/utils';
export { assessment } from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
