import type { Clearance, RuleGrade } from './types';

/** Calculate BMI from weight (kg) and height (cm). Returns null if inputs are invalid. */
export function calculateBMI(weightKg: number | null, heightCm: number | null): number | null {
	if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
	const heightM = heightCm / 100;
	return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
export function bmiCategory(bmi: number | null): string {
	if (bmi === null) return '';
	if (bmi < 17.5) return 'Very low (RED-S risk)';
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal';
	if (bmi < 30) return 'Overweight';
	return 'Obese';
}

/** Calculate age from date of birth string. */
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

/** Friendly label for a Clearance value. */
export function clearanceLabel(c: Clearance): string {
	switch (c) {
		case 'cleared':
			return 'Cleared';
		case 'conditional':
			return 'Cleared with Conditions';
		case 'pending':
			return 'Not Cleared Pending Further Evaluation';
		case 'not-cleared':
			return 'Not Cleared for Sport';
		default:
			return 'Not classified';
	}
}

/** Lily-token colour class for the clearance badge / banner. */
export function clearanceColor(c: Clearance): string {
	switch (c) {
		case 'cleared':
			return 'bg-success text-success-content border-success';
		case 'conditional':
			return 'bg-warning text-warning-content border-warning';
		case 'pending':
			return 'bg-warning text-warning-content border-warning';
		case 'not-cleared':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a rule grade. */
export function gradeLabel(g: RuleGrade | number): string {
	switch (g) {
		case 4:
			return 'Not Cleared';
		case 3:
			return 'Pending';
		case 2:
			return 'Conditional';
		case 1:
			return 'Informational';
		default:
			return `Grade ${g}`;
	}
}

/** Lily-token colour class for the rule-grade badge. */
export function gradeColor(g: RuleGrade | number): string {
	switch (g) {
		case 1:
			return 'bg-info text-info-content border-info';
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
