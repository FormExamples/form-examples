import type { DonorType, Eligibility, RiskLevel } from './types';

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

/** Calculate age (years) from date of birth string. */
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

/** Donor type human-readable label. */
export function donorTypeLabel(donorType: DonorType): string {
	switch (donorType) {
		case 'living':
			return 'Living donor';
		case 'deceased':
			return 'Deceased donor';
		default:
			return 'Not specified';
	}
}

/** Eligibility human-readable label. */
export function eligibilityLabel(eligibility: Eligibility): string {
	switch (eligibility) {
		case 'suitable':
			return 'Suitable';
		case 'conditionally-suitable':
			return 'Conditionally Suitable';
		case 'unsuitable':
			return 'Unsuitable';
		default:
			return 'Not classified';
	}
}

/** Eligibility colour class (Lily tokens). */
export function eligibilityColor(eligibility: Eligibility): string {
	switch (eligibility) {
		case 'suitable':
			return 'bg-success text-success-content border-success';
		case 'conditionally-suitable':
			return 'bg-warning text-warning-content border-warning';
		case 'unsuitable':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Risk level human-readable label. */
export function riskLevelLabel(risk: RiskLevel): string {
	switch (risk) {
		case 'low':
			return 'Low Risk';
		case 'moderate':
			return 'Moderate Risk';
		case 'high':
			return 'High Risk';
		case 'critical':
			return 'Critical Risk';
	}
}

/** Risk level colour class (Lily tokens). */
export function riskLevelColor(risk: RiskLevel): string {
	switch (risk) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
	}
}

/** Donor rule grade label (used by the Badge component in the rule audit table). */
export function gradeLabel(grade: number): string {
	switch (grade) {
		case 1:
			return 'Grade 1 - Minimal';
		case 2:
			return 'Grade 2 - Mild';
		case 3:
			return 'Grade 3 - Moderate';
		case 4:
			return 'Grade 4 - Severe';
		default:
			return `Grade ${grade}`;
	}
}

/** Donor rule grade colour class (used by the Badge component). */
export function gradeColor(grade: number): string {
	switch (grade) {
		case 1:
			return 'bg-success text-success-content border-success';
		case 2:
			return 'bg-warning text-warning-content border-warning';
		case 3:
			return 'bg-warning text-warning-content border-warning';
		case 4:
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
