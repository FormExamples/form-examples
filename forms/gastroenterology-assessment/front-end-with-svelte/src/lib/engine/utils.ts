import type { SeverityLevel } from './types';

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

/** GI severity level from composite score. */
export function severityLevelFromScore(score: number): SeverityLevel {
	if (score <= 10) return 'minimal';
	if (score <= 20) return 'mild';
	if (score <= 30) return 'moderate';
	if (score <= 40) return 'severe';
	return 'very-severe';
}

/** GI severity level display label. */
export function severityLabel(level: SeverityLevel): string {
	switch (level) {
		case 'minimal':
			return 'Minimal Symptoms (0-10)';
		case 'mild':
			return 'Mild (11-20)';
		case 'moderate':
			return 'Moderate (21-30)';
		case 'severe':
			return 'Severe (31-40)';
		case 'very-severe':
			return 'Very Severe (41+)';
		default:
			return 'Unknown';
	}
}

/** GI severity colour class. */
export function severityColor(level: SeverityLevel): string {
	switch (level) {
		case 'minimal':
			return 'bg-success text-success-content border-success';
		case 'mild':
			return 'bg-warning text-warning-content border-warning';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-error text-error-content border-error';
		case 'very-severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Bristol stool scale descriptions. */
export function bristolStoolDescription(type: string): string {
	switch (type) {
		case '1':
			return 'Type 1 - Separate hard lumps (severe constipation)';
		case '2':
			return 'Type 2 - Lumpy, sausage-shaped (mild constipation)';
		case '3':
			return 'Type 3 - Sausage with cracks (normal)';
		case '4':
			return 'Type 4 - Smooth, soft sausage (normal)';
		case '5':
			return 'Type 5 - Soft blobs with clear edges (lacking fibre)';
		case '6':
			return 'Type 6 - Fluffy, mushy pieces (mild diarrhoea)';
		case '7':
			return 'Type 7 - Entirely liquid (severe diarrhoea)';
		default:
			return '';
	}
}
