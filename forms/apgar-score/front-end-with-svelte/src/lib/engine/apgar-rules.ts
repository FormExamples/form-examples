import type { ApgarRule, SignDefinition, SignScore } from './types';

/**
 * Parse a '0' | '1' | '2' | '' sign selection to a number (0 when unanswered).
 */
export function signPoints(value: SignScore): number {
	return value === '' ? 0 : Number(value);
}

/**
 * Declarative Apgar sign-scoring rules.
 *
 * The Apgar score has exactly five signs (Appearance, Pulse, Grimace, Activity,
 * Respiration), each an explicit 0/1/2 selection. Unlike a binary criterion
 * screen, every sign contributes its own selected value (0, 1, or 2) to the
 * per-timepoint total of 0-10. Each rule reads one sign from a single timepoint
 * and returns its numeric points. The grader (`apgar-grader.ts`) sums the five
 * signs per timepoint. Rows mirror the `apgar_score_grade_rule` SQL table.
 */
export const apgarRules: ApgarRule[] = [
	// ─── SIGN A: APPEARANCE (skin colour) ─────────────────────────
	{
		id: 'R-APPEARANCE-01',
		sign: 'appearance',
		letter: 'A',
		category: 'apgar-sign',
		description:
			'Appearance (skin colour) — 0 blue/pale, 1 acrocyanosis, 2 completely pink',
		score: (t) => signPoints(t.appearance)
	},

	// ─── SIGN P: PULSE (heart rate) ───────────────────────────────
	{
		id: 'R-PULSE-01',
		sign: 'pulse',
		letter: 'P',
		category: 'apgar-sign',
		description: 'Pulse (heart rate) — 0 absent, 1 below 100/min, 2 at least 100/min',
		score: (t) => signPoints(t.pulse)
	},

	// ─── SIGN G: GRIMACE (reflex irritability) ────────────────────
	{
		id: 'R-GRIMACE-01',
		sign: 'grimace',
		letter: 'G',
		category: 'apgar-sign',
		description:
			'Grimace (reflex irritability) — 0 no response, 1 grimace/feeble cry, 2 cry/cough/sneeze',
		score: (t) => signPoints(t.grimace)
	},

	// ─── SIGN A: ACTIVITY (muscle tone) ───────────────────────────
	{
		id: 'R-ACTIVITY-01',
		sign: 'activity',
		letter: 'A',
		category: 'apgar-sign',
		description: 'Activity (muscle tone) — 0 limp, 1 some flexion, 2 active movement',
		score: (t) => signPoints(t.activity)
	},

	// ─── SIGN R: RESPIRATION ──────────────────────────────────────
	{
		id: 'R-RESPIRATION-01',
		sign: 'respiration',
		letter: 'R',
		category: 'apgar-sign',
		description: 'Respiration — 0 absent, 1 slow/irregular/weak cry, 2 strong regular cry',
		score: (t) => signPoints(t.respiration)
	}
];

/** The five Apgar signs, in APGAR order, with per-score descriptions. */
export const SIGNS: SignDefinition[] = [
	{
		field: 'appearance',
		letter: 'A',
		label: 'Appearance (skin colour)',
		scores: {
			'0': 'Blue or pale all over',
			'1': 'Body pink, extremities blue (acrocyanosis)',
			'2': 'Completely pink'
		}
	},
	{
		field: 'pulse',
		letter: 'P',
		label: 'Pulse (heart rate)',
		scores: {
			'0': 'Absent',
			'1': 'Below 100 beats per minute',
			'2': '100 beats per minute or more'
		}
	},
	{
		field: 'grimace',
		letter: 'G',
		label: 'Grimace (reflex irritability)',
		scores: {
			'0': 'No response to stimulation',
			'1': 'Grimace or feeble cry when stimulated',
			'2': 'Cry, cough, sneeze, or pulls away'
		}
	},
	{
		field: 'activity',
		letter: 'A',
		label: 'Activity (muscle tone)',
		scores: {
			'0': 'Limp / floppy',
			'1': 'Some flexion of limbs',
			'2': 'Active movement'
		}
	},
	{
		field: 'respiration',
		letter: 'R',
		label: 'Respiration',
		scores: {
			'0': 'Absent',
			'1': 'Slow, irregular, or weak cry',
			'2': 'Strong, regular cry'
		}
	}
];
