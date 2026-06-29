// HSE Management Standards Indicator Tool — items registry and benchmarks.
//
// The HSE tool comprises 35 statements across seven domains. Each statement is
// rated on a five-point Likert scale, using one of two response wordings:
//
//   FREQUENCY:  Never (1) | Seldom (2) | Sometimes (3) | Often (4) | Always (5)
//   AGREEMENT:  Strongly disagree (1) | Disagree (2) | Neutral (3) | Agree (4) | Strongly agree (5)
//
// Some items are positively worded (higher = better) and some are negatively
// worded (higher = worse). Negatively-worded items are reverse-scored (6 - raw)
// before the domain mean is computed, so a higher mean is always more
// favourable. Domain benchmarks are the indicative HSE 2007 norms (20th / 50th
// / 80th percentile cut-offs from the HSE interpretation guide).

import type { DomainKey, Department, HoursBand, TenureBand } from './types';

export type LikertScale = 'frequency' | 'agreement';

export interface LikertOption {
	value: number;
	label: string;
}

export interface StressItem {
	/** Field id (e.g. 'dem1'). */
	id: string;
	/** Domain key (e.g. 'demands'). */
	domain: DomainKey;
	/** The HSE statement, verbatim. */
	label: string;
	/** Which response wording to display. */
	scale: LikertScale;
	/** Whether to reverse-code (6 - raw) before averaging. */
	reverseScored: boolean;
}

export interface DomainMeta {
	key: DomainKey;
	title: string;
	stepNumber: number;
	description: string;
}

export interface DomainBenchmark {
	goodAt: number;
	moderateAt: number;
	highAt: number;
}

// ---------------------------------------------------------------------
// Likert scales (text labels for each numeric value 1..5)
// ---------------------------------------------------------------------

export const LIKERT_FREQUENCY: LikertOption[] = [
	{ value: 1, label: 'Never' },
	{ value: 2, label: 'Seldom' },
	{ value: 3, label: 'Sometimes' },
	{ value: 4, label: 'Often' },
	{ value: 5, label: 'Always' }
];

export const LIKERT_AGREEMENT: LikertOption[] = [
	{ value: 1, label: 'Strongly disagree' },
	{ value: 2, label: 'Disagree' },
	{ value: 3, label: 'Neutral' },
	{ value: 4, label: 'Agree' },
	{ value: 5, label: 'Strongly agree' }
];

/** Resolve a scale name to its option list. */
export function likertOptions(scale: LikertScale): LikertOption[] {
	return scale === 'agreement' ? LIKERT_AGREEMENT : LIKERT_FREQUENCY;
}

// ---------------------------------------------------------------------
// Domain meta (display titles, descriptions, item-counts)
// ---------------------------------------------------------------------

export const DOMAINS: DomainMeta[] = [
	{
		key: 'demands',
		title: 'Demands',
		stepNumber: 2,
		description: 'Workload, work patterns, and the physical or emotional demands placed on you.'
	},
	{
		key: 'control',
		title: 'Control',
		stepNumber: 3,
		description: 'How much say you have over the way you do your work.'
	},
	{
		key: 'managerSupport',
		title: 'Manager Support',
		stepNumber: 4,
		description: 'Encouragement, sponsorship and resources provided by line management.'
	},
	{
		key: 'peerSupport',
		title: 'Peer Support',
		stepNumber: 5,
		description: 'Encouragement, sponsorship and resources provided by colleagues.'
	},
	{
		key: 'relationships',
		title: 'Relationships',
		stepNumber: 6,
		description:
			'Promoting positive working to avoid conflict and dealing with unacceptable behaviour.'
	},
	{
		key: 'role',
		title: 'Role Clarity',
		stepNumber: 7,
		description:
			'Whether you understand your role and the organisation ensures roles do not conflict.'
	},
	{
		key: 'change',
		title: 'Organisational Change',
		stepNumber: 8,
		description: 'How organisational change (large or small) is managed and communicated.'
	}
];

// ---------------------------------------------------------------------
// Items (35 total)
// ---------------------------------------------------------------------

export const stressItems: StressItem[] = [
	// -------- Demands (8 items, all negatively worded — reverse-scored) ----
	{ id: 'dem1', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'Different groups at work demand things from me that are hard to combine.' },
	{ id: 'dem2', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'I have unachievable deadlines.' },
	{ id: 'dem3', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'I have to work very intensively.' },
	{ id: 'dem4', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'I have to neglect some tasks because I have too much to do.' },
	{ id: 'dem5', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'I am unable to take sufficient breaks.' },
	{ id: 'dem6', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'I am pressured to work long hours.' },
	{ id: 'dem7', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'I have to work very fast.' },
	{ id: 'dem8', domain: 'demands', scale: 'frequency', reverseScored: true, label: 'I have unrealistic time pressures.' },

	// -------- Control (6 items, all positively worded) ----------------
	{ id: 'ctrl1', domain: 'control', scale: 'frequency', reverseScored: false, label: 'I can decide when to take a break.' },
	{ id: 'ctrl2', domain: 'control', scale: 'agreement', reverseScored: false, label: 'I have a say in my own work speed.' },
	{ id: 'ctrl3', domain: 'control', scale: 'agreement', reverseScored: false, label: 'I have a choice in deciding how I do my work.' },
	{ id: 'ctrl4', domain: 'control', scale: 'agreement', reverseScored: false, label: 'I have a choice in deciding what I do at work.' },
	{ id: 'ctrl5', domain: 'control', scale: 'agreement', reverseScored: false, label: 'I have some say over the way I work.' },
	{ id: 'ctrl6', domain: 'control', scale: 'frequency', reverseScored: false, label: 'My working time can be flexible.' },

	// -------- Manager Support (5 items, all positively worded) ---------
	{ id: 'ms1', domain: 'managerSupport', scale: 'frequency', reverseScored: false, label: 'I am given supportive feedback on the work I do.' },
	{ id: 'ms2', domain: 'managerSupport', scale: 'agreement', reverseScored: false, label: 'I can rely on my line manager to help me out with a work problem.' },
	{ id: 'ms3', domain: 'managerSupport', scale: 'agreement', reverseScored: false, label: 'I can talk to my line manager about something that has upset or annoyed me about work.' },
	{ id: 'ms4', domain: 'managerSupport', scale: 'agreement', reverseScored: false, label: 'I am supported through emotionally demanding work.' },
	{ id: 'ms5', domain: 'managerSupport', scale: 'frequency', reverseScored: false, label: 'My line manager encourages me at work.' },

	// -------- Peer Support (4 items, all positively worded) ------------
	{ id: 'ps1', domain: 'peerSupport', scale: 'frequency', reverseScored: false, label: 'If work gets difficult, my colleagues will help me.' },
	{ id: 'ps2', domain: 'peerSupport', scale: 'frequency', reverseScored: false, label: 'I get help and support I need from colleagues.' },
	{ id: 'ps3', domain: 'peerSupport', scale: 'frequency', reverseScored: false, label: 'I receive the respect at work I deserve from my colleagues.' },
	{ id: 'ps4', domain: 'peerSupport', scale: 'frequency', reverseScored: false, label: 'My colleagues are willing to listen to my work-related problems.' },

	// -------- Relationships (4 items, all negatively worded — reverse-scored) ----
	{ id: 'rel1', domain: 'relationships', scale: 'frequency', reverseScored: true, label: 'I am subject to personal harassment in the form of unkind words or behaviour.' },
	{ id: 'rel2', domain: 'relationships', scale: 'frequency', reverseScored: true, label: 'There is friction or anger between colleagues.' },
	{ id: 'rel3', domain: 'relationships', scale: 'frequency', reverseScored: true, label: 'I am subject to bullying at work.' },
	{ id: 'rel4', domain: 'relationships', scale: 'frequency', reverseScored: true, label: 'Relationships at work are strained.' },

	// -------- Role Clarity (5 items, all positively worded) ------------
	{ id: 'role1', domain: 'role', scale: 'agreement', reverseScored: false, label: 'I am clear what is expected of me at work.' },
	{ id: 'role2', domain: 'role', scale: 'agreement', reverseScored: false, label: 'I know how to go about getting my job done.' },
	{ id: 'role3', domain: 'role', scale: 'agreement', reverseScored: false, label: 'I am clear what my duties and responsibilities are.' },
	{ id: 'role4', domain: 'role', scale: 'agreement', reverseScored: false, label: 'I am clear about the goals and objectives for my department.' },
	{ id: 'role5', domain: 'role', scale: 'agreement', reverseScored: false, label: 'I understand how my work fits into the overall aim of the organisation.' },

	// -------- Organisational Change (3 items, all positively worded) ---
	{ id: 'chg1', domain: 'change', scale: 'agreement', reverseScored: false, label: 'I have sufficient opportunities to question managers about change at work.' },
	{ id: 'chg2', domain: 'change', scale: 'agreement', reverseScored: false, label: 'Staff are always consulted about change at work.' },
	{ id: 'chg3', domain: 'change', scale: 'agreement', reverseScored: false, label: 'When changes are made at work, I am clear how they will work out in practice.' }
];

// ---------------------------------------------------------------------
// HSE benchmarks (mean cut-offs, indicative 2007 norms).
// A higher mean is better in every domain (after reverse-coding).
//
//   mean ≥ goodAt           → 'low'        (above 80th percentile)
//   moderateAt ≤ mean < good → 'moderate'   (50th–80th)
//   highAt     ≤ mean < mod  → 'high'       (20th–50th)
//   mean < highAt            → 'very-high'  (below 20th percentile)
// ---------------------------------------------------------------------

export const HSE_BENCHMARKS: Record<DomainKey, DomainBenchmark> = {
	demands: { goodAt: 4.17, moderateAt: 3.71, highAt: 3.32 },
	control: { goodAt: 4.1, moderateAt: 3.78, highAt: 3.46 },
	managerSupport: { goodAt: 4.31, moderateAt: 3.92, highAt: 3.51 },
	peerSupport: { goodAt: 4.16, moderateAt: 3.79, highAt: 3.49 },
	relationships: { goodAt: 4.49, moderateAt: 4.0, highAt: 3.62 },
	role: { goodAt: 4.71, moderateAt: 4.32, highAt: 3.91 },
	change: { goodAt: 3.55, moderateAt: 3.1, highAt: 2.71 }
};

// ---------------------------------------------------------------------
// Demographic option lists (kept deliberately broad to preserve anonymity)
// ---------------------------------------------------------------------

export const DEPARTMENT_OPTIONS: { value: Department; label: string }[] = [
	{ value: 'operations', label: 'Operations' },
	{ value: 'engineering', label: 'Engineering / IT' },
	{ value: 'sales-marketing', label: 'Sales / Marketing' },
	{ value: 'customer-service', label: 'Customer Service' },
	{ value: 'finance', label: 'Finance' },
	{ value: 'human-resources', label: 'Human Resources' },
	{ value: 'administration', label: 'Administration' },
	{ value: 'clinical', label: 'Clinical / Care' },
	{ value: 'research', label: 'Research' },
	{ value: 'leadership', label: 'Leadership / Executive' },
	{ value: 'other', label: 'Other / Prefer not to say' }
];

export const TENURE_OPTIONS: { value: TenureBand; label: string }[] = [
	{ value: 'less-than-1-year', label: 'Less than 1 year' },
	{ value: '1-to-3-years', label: '1 to 3 years' },
	{ value: '3-to-5-years', label: '3 to 5 years' },
	{ value: '5-to-10-years', label: '5 to 10 years' },
	{ value: 'more-than-10-years', label: 'More than 10 years' }
];

export const HOURS_OPTIONS: { value: HoursBand; label: string }[] = [
	{ value: 'part-time-under-20', label: 'Part-time (under 20 hours / week)' },
	{ value: 'part-time-20-to-34', label: 'Part-time (20–34 hours / week)' },
	{ value: 'full-time-35-to-44', label: 'Full-time (35–44 hours / week)' },
	{ value: 'long-hours-45-plus', label: 'Long hours (45+ hours / week)' }
];
