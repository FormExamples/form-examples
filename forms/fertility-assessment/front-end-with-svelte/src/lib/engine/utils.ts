import type { ConcernLevel } from './types';

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

/** Calculate age in whole years from a date-of-birth string. */
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

/** Concern level label (used by the report banner and dashboard). */
export function concernLevelLabel(level: ConcernLevel): string {
	switch (level) {
		case 'low':
			return 'Low concern';
		case 'moderate':
			return 'Moderate concern';
		case 'high':
			return 'High concern';
	}
}

/** Concern level Lily-token colour class. */
export function concernLevelColor(level: ConcernLevel): string {
	switch (level) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
	}
}

/** Short label for a fired-rule weight (used by the report Badge). */
export function ruleWeightLabel(weight: number): string {
	if (weight >= 3) return 'Major (+3)';
	if (weight === 2) return 'Moderate (+2)';
	return 'Minor (+1)';
}

/** Lily-token colour class for a fired-rule weight (used by the report Badge). */
export function ruleWeightColor(weight: number): string {
	if (weight >= 3) return 'bg-error text-error-content border-error';
	if (weight === 2) return 'bg-warning text-warning-content border-warning';
	return 'bg-info text-info-content border-info';
}

/** Human-readable label for a clinical recommendation value. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'continue-attempts':
			return 'Continue attempts';
		case 'lifestyle-optimisation':
			return 'Lifestyle optimisation';
		case 'targeted-treatment':
			return 'Targeted medical treatment';
		case 'specialist-referral':
			return 'Specialist referral';
		case 'art-referral':
			return 'ART (IVF/ICSI) referral';
		default:
			return '';
	}
}
