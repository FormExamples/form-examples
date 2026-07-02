import type { ComponentOption, SeverityBand } from './types';

/**
 * Declarative Glasgow Coma Scale scoring tables.
 *
 * The GCS rates the best response for each of three components — Eye opening
 * (E, 1-4), Verbal response (V, 1-5), and Motor response (M, 1-6) — from a
 * fixed descriptor list, plus a "not testable" (NT) option per component. This
 * file holds the descriptor→score lookup tables, the ordered option lists used
 * to build the wizard dropdowns, and the severity-band definitions. The grader
 * (`gcs-grader.ts`) resolves each component to a numeric score (or null for
 * NT), sums the total, derives the band, and computes the GCS-Pupils score.
 *
 * Rows mirror the descriptor tables in the form spec and the
 * `glasgow_coma_scale_grade_rule` SQL table.
 */

/** Eye opening (E) — descriptor options, high score first. */
export const eyeOptions: ComponentOption[] = [
	{ value: 'spontaneous', score: 4, label: '4 — Spontaneous (eyes open without stimulation)' },
	{ value: 'to-sound', score: 3, label: '3 — To sound (opens to spoken/shouted request)' },
	{ value: 'to-pressure', score: 2, label: '2 — To pressure (opens to fingertip pressure)' },
	{ value: 'none', score: 1, label: '1 — None (no eye opening to any stimulus)' },
	{ value: 'NT', score: null, label: 'NT — Not testable (e.g. periorbital swelling, dressings)' }
];

/** Verbal response (V) — descriptor options, high score first. */
export const verbalOptions: ComponentOption[] = [
	{ value: 'orientated', score: 5, label: '5 — Orientated (states name, place, and date)' },
	{ value: 'confused', score: 4, label: '4 — Confused (converses but disorientated)' },
	{ value: 'words', score: 3, label: '3 — Words (intelligible single words only)' },
	{ value: 'sounds', score: 2, label: '2 — Sounds (groans or moans, no words)' },
	{ value: 'none', score: 1, label: '1 — None (no audible response)' },
	{
		value: 'NT',
		score: null,
		label: 'NT — Not testable (e.g. intubation, tracheostomy, language barrier)'
	}
];

/** Motor response (M) — descriptor options, high score first. */
export const motorOptions: ComponentOption[] = [
	{ value: 'obeys-commands', score: 6, label: '6 — Obeys commands (performs a two-part request)' },
	{ value: 'localising', score: 5, label: '5 — Localising (purposeful movement to stimulus)' },
	{ value: 'normal-flexion', score: 4, label: '4 — Normal flexion (withdraws, not localising)' },
	{ value: 'abnormal-flexion', score: 3, label: '3 — Abnormal flexion (decorticate posturing)' },
	{ value: 'extension', score: 2, label: '2 — Extension (decerebrate posturing)' },
	{ value: 'none', score: 1, label: '1 — None (no motor response)' },
	{
		value: 'NT',
		score: null,
		label: 'NT — Not testable (e.g. neuromuscular blockade, spinal injury)'
	}
];

/** Resolve a component descriptor to its numeric score. Returns null for NT/unanswered. */
export function scoreFor(options: ComponentOption[], value: string): number | null {
	const opt = options.find((o) => o.value === value);
	return opt ? opt.score : null;
}

/** Human-readable descriptor label for a chosen component value. */
export function descriptorLabel(options: ComponentOption[], value: string): string {
	const opt = options.find((o) => o.value === value);
	return opt ? opt.label : '';
}

/** A severity band over the defined total (3-15). */
export interface SeverityBandDef {
	band: 'mild' | 'moderate' | 'severe';
	min: number;
	max: number;
	interpretation: string;
}

/** Severity bands over the defined total (3-15). Ordered high-to-low. */
export const severityBands: SeverityBandDef[] = [
	{ band: 'mild', min: 13, max: 15, interpretation: 'Mild impairment — normal-to-drowsy' },
	{ band: 'moderate', min: 9, max: 12, interpretation: 'Moderate impairment' },
	{
		band: 'severe',
		min: 3,
		max: 8,
		interpretation: 'Severe impairment — coma; GCS <= 8 signals airway risk'
	}
];

/** Band a defined total. Returns '' when total is null / out of range. */
export function bandForTotal(total: number | null): SeverityBand {
	if (total === null || total === undefined) return '';
	const found = severityBands.find((b) => total >= b.min && total <= b.max);
	return found ? found.band : '';
}
