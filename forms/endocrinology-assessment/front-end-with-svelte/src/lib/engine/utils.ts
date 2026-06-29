import type { AxisStatus } from './types';

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

/** Friendly label for an AxisStatus. */
export function axisStatusLabel(status: AxisStatus): string {
	switch (status) {
		case 'normal':
			return 'Normal';
		case 'subclinical':
			return 'Subclinical';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
		default:
			return 'Not assessed';
	}
}

/**
 * Lily token colour triple for an AxisStatus badge / banner.
 * normal → success, subclinical → info, mild/moderate → warning,
 * severe → error, '' (not assessed) → base-300.
 */
export function axisStatusColor(status: AxisStatus): string {
	switch (status) {
		case 'normal':
			return 'bg-success text-success-content border-success';
		case 'subclinical':
			return 'bg-info text-info-content border-info';
		case 'mild':
			return 'bg-warning text-warning-content border-warning';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/**
 * Compare two AxisStatus values; return the more severe of the two.
 * Order: severe > moderate > mild > subclinical > normal > '' (not assessed).
 */
export function maxStatus(a: AxisStatus, b: AxisStatus): AxisStatus {
	const order: Record<AxisStatus, number> = {
		'': 0,
		normal: 1,
		subclinical: 2,
		mild: 3,
		moderate: 4,
		severe: 5
	};
	return (order[a] || 0) >= (order[b] || 0) ? a : b;
}
