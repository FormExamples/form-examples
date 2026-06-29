/** A wizard step in the WHO Surgical Safety Checklist single-page form. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

export const TOTAL_STEPS = 5;

/**
 * The five wizard sections, rendered as one continuous single-page form:
 * case details, the three WHO safety phases (Sign In, Time Out, Sign Out),
 * and a summary / export section.
 */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Case details', shortTitle: 'Case' },
	{ number: 2, title: 'Sign In (before induction)', shortTitle: 'Sign In' },
	{ number: 3, title: 'Time Out (before incision)', shortTitle: 'Time Out' },
	{ number: 4, title: 'Sign Out (before leaving OR)', shortTitle: 'Sign Out' },
	{ number: 5, title: 'Summary and export', shortTitle: 'Summary' }
];
