import type { DiseaseActivity, DiseaseHistory } from './types';

/** Human-readable label for a primary diagnosis code. */
export function diagnosisLabel(diagnosis: DiseaseHistory['primaryDiagnosis']): string {
	switch (diagnosis) {
		case 'rheumatoid-arthritis':
			return 'Rheumatoid arthritis';
		case 'psoriatic-arthritis':
			return 'Psoriatic arthritis';
		case 'ankylosing-spondylitis':
			return 'Ankylosing spondylitis';
		case 'systemic-lupus':
			return 'Systemic lupus';
		case 'gout':
			return 'Gout';
		case 'osteoarthritis':
			return 'Osteoarthritis';
		case 'other':
			return 'Other';
		default:
			return '—';
	}
}

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

/** Classify disease activity from DAS28 score. */
export function classifyDiseaseActivity(das28: number | null): DiseaseActivity | null {
	if (das28 === null) return null;
	if (das28 < 2.6) return 'remission';
	if (das28 < 3.2) return 'low';
	if (das28 <= 5.1) return 'moderate';
	return 'high';
}

/** DAS28 disease activity label. */
export function das28Label(score: number | null): string {
	if (score === null) return 'Not calculated';
	const activity = classifyDiseaseActivity(score);
	switch (activity) {
		case 'remission':
			return `DAS28 ${score.toFixed(2)} - Remission`;
		case 'low':
			return `DAS28 ${score.toFixed(2)} - Low Disease Activity`;
		case 'moderate':
			return `DAS28 ${score.toFixed(2)} - Moderate Disease Activity`;
		case 'high':
			return `DAS28 ${score.toFixed(2)} - High Disease Activity`;
		default:
			return `DAS28 ${score.toFixed(2)}`;
	}
}

/** DAS28 disease activity colour class. */
export function das28Color(score: number | null): string {
	if (score === null) return 'bg-base-300 text-base-content border-base-300';
	const activity = classifyDiseaseActivity(score);
	switch (activity) {
		case 'remission':
			return 'bg-success text-success-content border-success';
		case 'low':
			return 'bg-warning text-warning-content border-warning';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Disease activity label without score for display. */
export function diseaseActivityLabel(activity: DiseaseActivity | null): string {
	switch (activity) {
		case 'remission':
			return 'Remission';
		case 'low':
			return 'Low Disease Activity';
		case 'moderate':
			return 'Moderate Disease Activity';
		case 'high':
			return 'High Disease Activity';
		default:
			return 'Not calculated';
	}
}
