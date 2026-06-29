// Public exports for the $lib alias.
export * from './engine/types';
export { b1Rules } from './engine/b1-rules';
export { validateB1 } from './engine/b1-validator';
export { detectFlaggedIssues } from './engine/flagged-issues';
export {
	calculateAge,
	epilepsyDeclarationRequired,
	hasText,
	isYesNoAnswered,
	priorityColor,
	priorityLabel,
	sectionLabel
} from './engine/utils';
export { assessment, createDefaultAssessment } from './stores/assessment.svelte';
export { steps, TOTAL_STEPS } from './config/steps';
