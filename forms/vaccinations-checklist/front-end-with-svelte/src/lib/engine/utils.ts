import type { ComplianceStatus, RiskLevel } from './types';

/** Calculate BMI from weight (kg) and height (cm). Returns null if inputs are invalid. */
export function calculateBMI(weightKg: number | null, heightCm: number | null): number | null {
	if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
	const heightM = heightCm / 100;
	return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
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

/** Compliance status label. */
export function complianceStatusLabel(status: ComplianceStatus): string {
	switch (status) {
		case 'fully-immunised':
			return 'Fully Immunised';
		case 'partially-immunised':
			return 'Partially Immunised';
		case 'non-compliant':
			return 'Non-Compliant';
		case 'contraindicated':
			return 'Contraindicated';
	}
}

/** Risk level label. */
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

/** Compliance status colour class. */
export function complianceStatusColor(status: ComplianceStatus): string {
	switch (status) {
		case 'fully-immunised':
			return 'bg-success text-success-content border-success';
		case 'partially-immunised':
			return 'bg-warning text-warning-content border-warning';
		case 'non-compliant':
			return 'bg-error text-error-content border-error';
		case 'contraindicated':
			return 'bg-warning text-warning-content border-warning';
	}
}

/** Risk level colour class. */
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

/** Grade colour class (used by Badge component). */
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

/** Grade label (used by Badge component). */
export function gradeLabel(grade: number): string {
	switch (grade) {
		case 1:
			return 'Low';
		case 2:
			return 'Moderate';
		case 3:
			return 'Significant';
		case 4:
			return 'Critical';
		default:
			return `Grade ${grade}`;
	}
}
