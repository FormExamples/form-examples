import type { RiskLevel } from './types';

/** Calculate BMI from weight (kg) and height (cm). Returns null if inputs are invalid. */
export function calculateBMI(weightKg: number | null, heightCm: number | null): number | null {
	if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
	const heightM = heightCm / 100;
	return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
export function bmiCategory(bmi: number | null): string {
	if (bmi === null) return '';
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal';
	if (bmi < 30) return 'Overweight';
	if (bmi < 35) return 'Obese Class I';
	if (bmi < 40) return 'Obese Class II';
	return 'Obese Class III (Morbid)';
}

/** Compute wound area (cm²) from length × width. Returns null if invalid. */
export function calculateWoundArea(length: number | null, width: number | null): number | null {
	if (length == null || width == null || length <= 0 || width <= 0) return null;
	return Math.round(length * width * 10) / 10;
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

/** Friendly label for a Braden risk level. */
export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'very-high-risk':
			return 'Very High Risk';
		case 'high-risk':
			return 'High Risk';
		case 'moderate-risk':
			return 'Moderate Risk';
		case 'mild-risk':
			return 'Mild Risk';
		case 'no-risk':
			return 'No Risk';
	}
}

/** Lily token colour classes for a Braden risk level. */
export function riskLevelColor(level: RiskLevel): string {
	switch (level) {
		case 'no-risk':
			return 'bg-success text-success-content border-success';
		case 'mild-risk':
			return 'bg-warning text-warning-content border-warning';
		case 'moderate-risk':
			return 'bg-warning text-warning-content border-warning';
		case 'high-risk':
			return 'bg-error text-error-content border-error';
		case 'very-high-risk':
			return 'bg-error text-error-content border-error';
	}
}

/**
 * Lily token colour classes for a single Braden subscale score relative to its
 * maximum. A lower proportion of the maximum indicates higher risk.
 */
export function subscaleColor(score: number, maxScore: number): string {
	const ratio = maxScore > 0 ? score / maxScore : 1;
	if (ratio <= 0.5) return 'bg-error text-error-content border-error';
	if (ratio < 1) return 'bg-warning text-warning-content border-warning';
	return 'bg-success text-success-content border-success';
}

/** Lily token colour classes for a flag priority. */
export function priorityColor(priority: 'urgent' | 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}
