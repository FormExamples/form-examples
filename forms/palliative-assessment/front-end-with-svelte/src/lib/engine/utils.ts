import type { ESASSymptomKey, SeverityBand } from './types';

/**
 * Static metadata about the ten ESAS-r items: keys, labels, and the
 * conventional "low pole" / "high pole" descriptions used in the patient
 * questionnaire. The "other" item is a user-labelled wildcard (often
 * constipation, sleep, or itch).
 */
export interface ESASItem {
	key: ESASSymptomKey;
	label: string;
	lowPole: string;
	highPole: string;
}

export const ESAS_ITEMS: ESASItem[] = [
	{ key: 'pain', label: 'Pain', lowPole: 'No pain', highPole: 'Worst possible pain' },
	{ key: 'tiredness', label: 'Tiredness (lack of energy)', lowPole: 'No tiredness', highPole: 'Worst possible tiredness' },
	{ key: 'drowsiness', label: 'Drowsiness (feeling sleepy)', lowPole: 'No drowsiness', highPole: 'Worst possible drowsiness' },
	{ key: 'nausea', label: 'Nausea', lowPole: 'No nausea', highPole: 'Worst possible nausea' },
	{ key: 'lackOfAppetite', label: 'Lack of appetite', lowPole: 'No lack of appetite', highPole: 'Worst possible lack of appetite' },
	{ key: 'shortnessOfBreath', label: 'Shortness of breath', lowPole: 'No shortness of breath', highPole: 'Worst possible shortness of breath' },
	{ key: 'depression', label: 'Depression (feeling sad)', lowPole: 'No depression', highPole: 'Worst possible depression' },
	{ key: 'anxiety', label: 'Anxiety (feeling nervous)', lowPole: 'No anxiety', highPole: 'Worst possible anxiety' },
	{ key: 'wellbeing', label: 'Wellbeing (how you feel overall)', lowPole: 'Best wellbeing', highPole: 'Worst wellbeing' },
	{ key: 'other', label: 'Other symptom', lowPole: 'No symptom', highPole: 'Worst possible' }
];

/**
 * Classify a numeric ESAS-r total (0-100) into a severity band.
 * Bands: None 0-10, Mild 11-30, Moderate 31-60, Severe 61-100.
 */
export function classifyESASTotal(total: number): SeverityBand {
	if (total <= 10) return 'none';
	if (total <= 30) return 'mild';
	if (total <= 60) return 'moderate';
	return 'severe';
}

/** Friendly label for a severity band. */
export function severityBandLabel(band: SeverityBand): string {
	switch (band) {
		case 'none':
			return 'None / Minimal';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
		default:
			return '';
	}
}

/** Lily token colour triple for a severity band (used by the Badge / banner). */
export function severityBandColor(band: SeverityBand): string {
	switch (band) {
		case 'none':
			return 'bg-success text-success-content border-success';
		case 'mild':
			return 'bg-info text-info-content border-info';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/**
 * Classify an individual ESAS-r symptom (0-10) into none/mild/moderate/severe.
 *   0     -> none
 *   1-3   -> mild
 *   4-6   -> moderate
 *   7-10  -> severe
 */
export function classifyIndividualSymptom(score: number | null): SeverityBand | '' {
	if (score === null || score === undefined) return '';
	if (score <= 0) return 'none';
	if (score <= 3) return 'mild';
	if (score <= 6) return 'moderate';
	return 'severe';
}

/** Palliative Performance Scale (PPS) band derived from a 10-100 value. */
export function ppsBand(pps: number | null): 'high' | 'moderate' | 'low' | '' {
	if (pps === null || pps === undefined) return '';
	if (pps >= 70) return 'high';
	if (pps >= 40) return 'moderate';
	return 'low';
}

/** Friendly label for a PPS band. */
export function ppsBandLabel(band: 'high' | 'moderate' | 'low' | ''): string {
	switch (band) {
		case 'high':
			return 'High (70-100)';
		case 'moderate':
			return 'Moderate (40-60)';
		case 'low':
			return 'Low (10-30)';
		default:
			return '—';
	}
}

/** Lily token colour triple for a flag priority. */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Calculate age from a date-of-birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}
