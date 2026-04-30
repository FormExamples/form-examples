import type { DassSeverity, SubscaleScore } from './types';

/** Calculate age from a date-of-birth string. Returns null on invalid input. */
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

/**
 * Classify a DASS-21 subscale into a severity category.
 * `scaled` is the doubled raw score (raw 0–21 → scaled 0–42) so it aligns
 * with the published DASS-42 normative cutoffs (Lovibond & Lovibond, 1995).
 */
export function classifyDassDepression(scaled: number): DassSeverity {
	if (scaled <= 9) return 'normal';
	if (scaled <= 13) return 'mild';
	if (scaled <= 20) return 'moderate';
	if (scaled <= 27) return 'severe';
	return 'extremely-severe';
}

export function classifyDassAnxiety(scaled: number): DassSeverity {
	if (scaled <= 7) return 'normal';
	if (scaled <= 9) return 'mild';
	if (scaled <= 14) return 'moderate';
	if (scaled <= 19) return 'severe';
	return 'extremely-severe';
}

export function classifyDassStress(scaled: number): DassSeverity {
	if (scaled <= 14) return 'normal';
	if (scaled <= 18) return 'mild';
	if (scaled <= 25) return 'moderate';
	if (scaled <= 33) return 'severe';
	return 'extremely-severe';
}

/** Human-readable label for a DASS severity category. */
export function severityLabel(severity: DassSeverity | ''): string {
	switch (severity) {
		case 'normal':
			return 'Normal';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
		case 'extremely-severe':
			return 'Extremely Severe';
		default:
			return '';
	}
}

/** Tailwind colour classes for a severity badge. */
export function severityColor(severity: DassSeverity | ''): string {
	switch (severity) {
		case 'normal':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'mild':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'moderate':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'severe':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'extremely-severe':
			return 'bg-red-200 text-red-900 border-red-400';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Subscale label for display. */
export function subscaleLabel(subscale: 'depression' | 'anxiety' | 'stress'): string {
	switch (subscale) {
		case 'depression':
			return 'Depression';
		case 'anxiety':
			return 'Anxiety';
		case 'stress':
			return 'Stress';
	}
}

/** Compose a short summary line for a subscale result. */
export function subscaleSummary(
	subscale: 'depression' | 'anxiety' | 'stress',
	score: SubscaleScore
): string {
	return `${subscaleLabel(subscale)}: ${score.scaled} (${severityLabel(score.severity)})`;
}
