import type { CompetencyLevel, FitnessDecision, RiskLevel } from './types';

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

/** Competency level numeric value (1-4). */
export function competencyToNumber(level: CompetencyLevel): number {
	switch (level) {
		case 'not-competent':
			return 1;
		case 'developing':
			return 2;
		case 'competent':
			return 3;
		case 'expert':
			return 4;
		default:
			return 0;
	}
}

/** Competency level label. */
export function competencyLabel(level: CompetencyLevel): string {
	switch (level) {
		case 'not-competent':
			return 'Not Competent';
		case 'developing':
			return 'Developing';
		case 'competent':
			return 'Competent';
		case 'expert':
			return 'Expert';
		default:
			return 'Not assessed';
	}
}

/** Competency level colour class. */
export function competencyColor(level: CompetencyLevel): string {
	switch (level) {
		case 'not-competent':
			return 'bg-error text-error-content border-error';
		case 'developing':
			return 'bg-warning text-warning-content border-warning';
		case 'competent':
			return 'bg-success text-success-content border-success';
		case 'expert':
			return 'bg-info text-info-content border-info';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Fitness decision label. */
export function fitnessDecisionLabel(decision: FitnessDecision): string {
	switch (decision) {
		case 'fit-for-duty':
			return 'Fit for Duty';
		case 'fit-with-restrictions':
			return 'Fit with Restrictions';
		case 'temporarily-unfit':
			return 'Temporarily Unfit';
		case 'permanently-unfit':
			return 'Permanently Unfit';
		default:
			return 'Not determined';
	}
}

/** Fitness decision colour class. */
export function fitnessDecisionColor(decision: FitnessDecision): string {
	switch (decision) {
		case 'fit-for-duty':
			return 'bg-success text-success-content border-success';
		case 'fit-with-restrictions':
			return 'bg-warning text-warning-content border-warning';
		case 'temporarily-unfit':
			return 'bg-warning text-warning-content border-warning';
		case 'permanently-unfit':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall risk level label. */
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

/** Grade label (used by Badge component). */
export function gradeLabel(grade: number): string {
	switch (grade) {
		case 1:
			return 'Grade 1 - Minor';
		case 2:
			return 'Grade 2 - Moderate';
		case 3:
			return 'Grade 3 - Significant';
		case 4:
			return 'Grade 4 - Critical';
		default:
			return `Grade ${grade}`;
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

/** Aggregate an array of competency levels into a single domain level. Uses the lowest (worst) competency. */
export function aggregateCompetency(levels: CompetencyLevel[]): CompetencyLevel {
	const valid = levels.filter((l) => l !== '');
	if (valid.length === 0) return '';
	const nums = valid.map(competencyToNumber);
	const minVal = Math.min(...nums);
	switch (minVal) {
		case 1:
			return 'not-competent';
		case 2:
			return 'developing';
		case 3:
			return 'competent';
		case 4:
			return 'expert';
		default:
			return '';
	}
}
