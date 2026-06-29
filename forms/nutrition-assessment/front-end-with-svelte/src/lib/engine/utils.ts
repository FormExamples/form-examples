import type { MUSTRisk, SeverityLevel } from './types';

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

/**
 * Calculate unplanned weight loss as a percentage of usual weight.
 * Returns null if either value is missing or invalid. Rounded to 1 decimal.
 */
export function calculateWeightLossPercent(
	weightLossKg: number | null,
	usualWeightKg: number | null
): number | null {
	if (
		weightLossKg === null ||
		weightLossKg === undefined ||
		usualWeightKg === null ||
		usualWeightKg === undefined ||
		usualWeightKg <= 0
	) {
		return null;
	}
	return Math.round((weightLossKg / usualWeightKg) * 1000) / 10;
}

/** Suggest a MUST BMI category from a numeric BMI. */
export function suggestBmiCategory(bmi: number | null): '>=20' | '18.5-20' | '<18.5' | '' {
	if (bmi === null || bmi === undefined) return '';
	if (bmi > 20) return '>=20';
	if (bmi >= 18.5) return '18.5-20';
	return '<18.5';
}

/** Suggest a MUST weight-loss category from a percentage. */
export function suggestWeightLossCategory(pct: number | null): '<5' | '5-10' | '>10' | '' {
	if (pct === null || pct === undefined) return '';
	if (pct < 5) return '<5';
	if (pct <= 10) return '5-10';
	return '>10';
}

/** Classify a numeric MUST score (0-6) into a risk band. */
export function classifyMUSTScore(score: number): MUSTRisk {
	if (score >= 2) return 'high';
	if (score === 1) return 'medium';
	return 'low';
}

/** Map a MUST risk band to a baseline severity level. */
export function mustRiskToSeverity(risk: MUSTRisk): SeverityLevel {
	switch (risk) {
		case 'low':
			return 'low';
		case 'medium':
			return 'moderate';
		case 'high':
			return 'high';
		default:
			return 'low';
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

/** Friendly label for a MUST risk band. */
export function mustRiskLabel(risk: MUSTRisk): string {
	switch (risk) {
		case 'low':
			return 'Low Risk';
		case 'medium':
			return 'Medium Risk';
		case 'high':
			return 'High Risk';
		default:
			return '';
	}
}

/** Friendly label for an overall severity level. */
export function severityLabel(level: SeverityLevel): string {
	switch (level) {
		case 'low':
			return 'Well-Nourished';
		case 'moderate':
			return 'At Risk of Malnutrition';
		case 'high':
			return 'Malnourished';
		case 'critical':
			return 'Severe Malnutrition with Complications';
		default:
			return '';
	}
}

/** Severity colour class (Lily tokens). */
export function severityColor(level: SeverityLevel): string {
	switch (level) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** MUST risk colour class (Lily tokens). */
export function mustRiskColor(risk: MUSTRisk): string {
	switch (risk) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag priority colour class (Lily tokens). */
export function flagPriorityColor(priority: 'urgent' | 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'medium':
			return 'bg-info text-info-content border-info';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
