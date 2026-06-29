import type { AsaClass, MallampatiClass, RiskLevel } from './types';

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

/** Calculate age from a YYYY-MM-DD date-of-birth string. Returns null if invalid. */
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

/** Friendly label for an overall perioperative risk level. */
export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'Low Risk';
		case 'medium':
			return 'Moderate Risk';
		case 'high':
			return 'High Risk';
		case 'critical':
			return 'Critical Risk';
	}
}

/** Lily token colour triple for a risk level (used by badges and banners). */
export function riskLevelColor(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
	}
}

/** Lily token colour triple for a flag priority. */
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

/** Compare two risk levels; returns the worse (higher) of the two. */
export function worstRisk(a: RiskLevel, b: RiskLevel): RiskLevel {
	const order: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 };
	return order[a] >= order[b] ? a : b;
}

/** Friendly long label for an ASA Physical Status class. */
export function asaClassLabel(klass: AsaClass): string {
	switch (klass) {
		case 'i':
			return 'ASA I — Healthy';
		case 'ii':
			return 'ASA II — Mild systemic disease';
		case 'iii':
			return 'ASA III — Severe systemic disease';
		case 'iv':
			return 'ASA IV — Severe disease, constant threat to life';
		case 'v':
			return 'ASA V — Moribund, not expected to survive without surgery';
		case 'vi':
			return 'ASA VI — Brain-dead, organ donor';
		default:
			return 'Not classified';
	}
}

/** Short Roman-numeral form for an ASA class (`iii` → `ASA III`). */
export function asaClassShort(klass: AsaClass): string {
	return klass ? `ASA ${klass.toUpperCase()}` : '—';
}

/** Friendly label for a Mallampati airway class. */
export function mallampatiLabel(klass: MallampatiClass): string {
	switch (klass) {
		case 'i':
			return 'Mallampati Class I';
		case 'ii':
			return 'Mallampati Class II';
		case 'iii':
			return 'Mallampati Class III';
		case 'iv':
			return 'Mallampati Class IV';
		default:
			return 'Not assessed';
	}
}

/** Short Roman-numeral form for a Mallampati class (`iii` → `MP III`). */
export function mallampatiShort(klass: MallampatiClass): string {
	return klass ? `MP ${klass.toUpperCase()}` : '—';
}
