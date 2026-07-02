import type { AldreteRule } from './types';

/**
 * Declarative Modified Aldrete + PADSS scoring rules.
 *
 * The Modified Aldrete Score has exactly five parameters (activity,
 * respiration, circulation, consciousness, oxygen saturation), each mapping an
 * enum answer to a 0/1/2 level; the grader (`pacu-grader.ts`) sums the five
 * levels into the total (0-10) and derives the readiness band. The optional
 * PADSS (Post-Anaesthesia Discharge Scoring System) has five criteria, each
 * 0/1/2. The score maps below are the single source of truth for both the
 * grader and the wizard's per-parameter option lists, and mirror the CHECK
 * constraints in `sql/04_create_table_post_anaesthesia_care_unit_record.sql`.
 */

// ─── Aldrete parameter enum → 0/1/2 level ─────────────────────────────
export const ALDRETE_SCORES: Record<string, Record<string, 0 | 1 | 2>> = {
	activity: { 'all-four': 2, two: 1, none: 0 },
	respiration: { 'deep-cough': 2, limited: 1, apnoeic: 0 },
	circulation: { 'within-20': 2, 'within-50': 1, 'over-50': 0 },
	consciousness: { awake: 2, arousable: 1, unresponsive: 0 },
	oxygenSaturation: { 'room-air': 2, 'needs-o2': 1, 'low-on-o2': 0 }
};

// ─── PADSS criterion enum → 0/1/2 level ───────────────────────────────
export const PADSS_SCORES: Record<string, Record<string, 0 | 1 | 2>> = {
	padssVitalSigns: { 'within-20': 2, 'within-40': 1, 'over-40': 0 },
	padssAmbulation: { steady: 2, 'with-assistance': 1, unable: 0 },
	padssNauseaVomiting: { minimal: 2, moderate: 1, severe: 0 },
	padssPain: { minimal: 2, moderate: 1, severe: 0 },
	padssSurgicalBleeding: { minimal: 2, moderate: 1, severe: 0 }
};

/** Score a single Aldrete parameter. A missing ('') answer contributes 0. */
export function aldreteScore(parameter: string, value: string): 0 | 1 | 2 {
	const map = ALDRETE_SCORES[parameter];
	if (!map) return 0;
	const score = map[value];
	return score === undefined ? 0 : score;
}

/** Score a single PADSS criterion, or null when the answer is missing. */
export function padssScore(criterion: string, value: string): 0 | 1 | 2 | null {
	const map = PADSS_SCORES[criterion];
	if (!map) return null;
	const score = map[value];
	return score === undefined ? null : score;
}

/**
 * Rule metadata rows, mirroring the
 * `post_anaesthesia_care_unit_record_grade_rule` SQL table. The `get` accessor
 * pulls the raw enum answer out of the nested record so the grader can award
 * points.
 */
export const aldreteRules: AldreteRule[] = [
	{
		id: 'R-ACTIVITY-01',
		parameter: 'activity',
		category: 'aldrete-parameter',
		description: 'Activity — voluntary limb movement on command',
		get: (d) => d.activity.activity
	},
	{
		id: 'R-RESPIRATION-01',
		parameter: 'respiration',
		category: 'aldrete-parameter',
		description: 'Respiration — breathing effort, cough, ventilation',
		get: (d) => d.respiration.respiration
	},
	{
		id: 'R-CIRCULATION-01',
		parameter: 'circulation',
		category: 'aldrete-parameter',
		description: 'Circulation — blood pressure deviation from baseline',
		get: (d) => d.circulation.circulation
	},
	{
		id: 'R-CONSCIOUSNESS-01',
		parameter: 'consciousness',
		category: 'aldrete-parameter',
		description: 'Consciousness — level of arousal',
		get: (d) => d.consciousness.consciousness
	},
	{
		id: 'R-OXYGEN-SATURATION-01',
		parameter: 'oxygenSaturation',
		category: 'aldrete-parameter',
		description: 'Oxygen saturation — SpO2 and supplemental-oxygen need',
		get: (d) => d.oxygenSaturation.oxygenSaturation
	}
];

// ─── Wizard option lists (single source of truth for inputs + labels) ──
export interface Option {
	value: string;
	label: string;
}

export const ALDRETE_OPTIONS: Record<string, Option[]> = {
	activity: [
		{ value: 'all-four', label: 'Moves all four limbs (2)' },
		{ value: 'two', label: 'Moves two limbs (1)' },
		{ value: 'none', label: 'Unable to move limbs (0)' }
	],
	respiration: [
		{ value: 'deep-cough', label: 'Breathes deeply and coughs freely (2)' },
		{ value: 'limited', label: 'Dyspnoea, shallow or limited breathing (1)' },
		{ value: 'apnoeic', label: 'Apnoeic / requires ventilation (0)' }
	],
	circulation: [
		{ value: 'within-20', label: 'BP within 20 mmHg of baseline (2)' },
		{ value: 'within-50', label: 'BP within 20-50 mmHg of baseline (1)' },
		{ value: 'over-50', label: 'BP more than 50 mmHg from baseline (0)' }
	],
	consciousness: [
		{ value: 'awake', label: 'Fully awake (2)' },
		{ value: 'arousable', label: 'Arousable on calling (1)' },
		{ value: 'unresponsive', label: 'Not responding (0)' }
	],
	oxygenSaturation: [
		{ value: 'room-air', label: 'SpO2 above 92% on room air (2)' },
		{ value: 'needs-o2', label: 'Needs supplemental oxygen to keep SpO2 above 90% (1)' },
		{ value: 'low-on-o2', label: 'SpO2 below 90% even with supplemental oxygen (0)' }
	]
};

export const PADSS_OPTIONS: Record<string, Option[]> = {
	padssVitalSigns: [
		{ value: 'within-20', label: 'Within 20% of baseline (2)' },
		{ value: 'within-40', label: 'Within 20-40% of baseline (1)' },
		{ value: 'over-40', label: 'More than 40% from baseline (0)' }
	],
	padssAmbulation: [
		{ value: 'steady', label: 'Steady gait, no dizziness (2)' },
		{ value: 'with-assistance', label: 'Ambulates with assistance (1)' },
		{ value: 'unable', label: 'Unable / dizziness (0)' }
	],
	padssNauseaVomiting: [
		{ value: 'minimal', label: 'Minimal (2)' },
		{ value: 'moderate', label: 'Moderate, treated (1)' },
		{ value: 'severe', label: 'Severe, persistent (0)' }
	],
	padssPain: [
		{ value: 'minimal', label: 'Minimal, acceptable (2)' },
		{ value: 'moderate', label: 'Moderate (1)' },
		{ value: 'severe', label: 'Severe (0)' }
	],
	padssSurgicalBleeding: [
		{ value: 'minimal', label: 'Minimal (2)' },
		{ value: 'moderate', label: 'Moderate (1)' },
		{ value: 'severe', label: 'Severe (0)' }
	]
};

/** Human-readable label for an Aldrete parameter answer. */
export function aldreteValueLabel(parameter: string, value: string): string {
	const opt = (ALDRETE_OPTIONS[parameter] || []).find((o) => o.value === value);
	return opt ? opt.label : 'Not recorded';
}
