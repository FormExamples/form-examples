import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Organiser & metadata', shortTitle: 'Organiser', section: 'organizer' },
	{ number: 2, title: 'Title & purpose', shortTitle: 'Title', section: 'meta' },
	{ number: 3, title: 'Invitation', shortTitle: 'Invitation', section: 'invitation' },
	{ number: 4, title: 'Agenda', shortTitle: 'Agenda', section: 'agenda' },
	{ number: 5, title: 'Participants', shortTitle: 'Participants', section: 'participants' },
	{ number: 6, title: 'Resources', shortTitle: 'Resources', section: 'resources' },
	{ number: 7, title: 'Recurrence', shortTitle: 'Recurrence', section: 'recurrence' },
	{ number: 8, title: 'Summary', shortTitle: 'Summary', section: 'summary' },
	{ number: 9, title: 'Action items, outputs, outcomes', shortTitle: 'Results', section: 'results' },
	{ number: 10, title: 'Sign-off', shortTitle: 'Sign-off', section: 'signoff' }
];
