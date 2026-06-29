import type { SeverityCategory, SupportLevel } from './types';

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
	return 'Obese Class III';
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

/** Convert a SupportLevel to its 0-3 numeric weight (0 if blank). */
export function levelScore(level: SupportLevel): number {
	switch (level) {
		case 'independent':
			return 0;
		case 'some-support':
			return 1;
		case 'significant-support':
			return 2;
		case 'full-support':
			return 3;
		default:
			return 0;
	}
}

/** Friendly label for a per-item 0-3 adaptive support score. */
export function supportLevelLabel(score: number): string {
	switch (score) {
		case 0:
			return 'Independent';
		case 1:
			return 'Some support';
		case 2:
			return 'Significant support';
		case 3:
			return 'Full support';
		default:
			return '';
	}
}

/** Classify a mean adaptive score (0-3) into a severity category. */
export function classifyAdaptiveScore(mean: number): SeverityCategory {
	if (mean >= 2.6) return 'profound';
	if (mean >= 2.0) return 'severe';
	if (mean >= 1.0) return 'moderate';
	return 'mild';
}

/** Friendly label for a SeverityCategory. */
export function severityLabel(sev: SeverityCategory): string {
	switch (sev) {
		case 'mild':
			return 'Mild Learning Disability';
		case 'moderate':
			return 'Moderate Learning Disability';
		case 'severe':
			return 'Severe Learning Disability';
		case 'profound':
			return 'Profound Learning Disability';
		default:
			return 'Not classified';
	}
}

/** One-line description for the severity category. */
export function severityDescription(sev: SeverityCategory): string {
	switch (sev) {
		case 'mild':
			return 'Independent with support in complex tasks (DSM-5-TR mild range).';
		case 'moderate':
			return 'Needs significant support with daily living (DSM-5-TR moderate range).';
		case 'severe':
			return 'Needs substantial support; limited communication (DSM-5-TR severe range).';
		case 'profound':
			return 'Very limited understanding and communication; intensive support (DSM-5-TR profound range).';
		default:
			return '';
	}
}

/** DSM-5-TR aligned IQ band for the severity category. */
export function severityIqBand(sev: SeverityCategory): string {
	switch (sev) {
		case 'mild':
			return '50-69';
		case 'moderate':
			return '35-49';
		case 'severe':
			return '20-34';
		case 'profound':
			return '<20';
		default:
			return '—';
	}
}

/** Severity badge colour class (Lily tokens). */
export function severityColor(sev: SeverityCategory): string {
	switch (sev) {
		case 'mild':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-warning text-warning-content border-warning';
		case 'profound':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority colour class (Lily tokens). */
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
