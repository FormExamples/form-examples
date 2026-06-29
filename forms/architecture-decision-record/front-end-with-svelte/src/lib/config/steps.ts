import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 16;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Author identification', shortTitle: 'Author' },
	{ number: 2, title: 'Organization & context', shortTitle: 'Org' },
	{ number: 3, title: 'Issue', shortTitle: 'Issue' },
	{ number: 4, title: 'Decision', shortTitle: 'Decision' },
	{ number: 5, title: 'Status & group', shortTitle: 'Status' },
	{ number: 6, title: 'Assumptions', shortTitle: 'Assumptions' },
	{ number: 7, title: 'Constraints', shortTitle: 'Constraints' },
	{ number: 8, title: 'Positions (alternatives)', shortTitle: 'Positions' },
	{ number: 9, title: 'Argument', shortTitle: 'Argument' },
	{ number: 10, title: 'Implications', shortTitle: 'Implications' },
	{ number: 11, title: 'Related decisions', shortTitle: 'Decisions' },
	{ number: 12, title: 'Related requirements', shortTitle: 'Requirements' },
	{ number: 13, title: 'Related artifacts', shortTitle: 'Artifacts' },
	{ number: 14, title: 'Related principles', shortTitle: 'Principles' },
	{ number: 15, title: 'Notes', shortTitle: 'Notes' },
	{ number: 16, title: 'Summary & sign-off', shortTitle: 'Sign-off' }
];
