import type { RiskLevel } from './types';

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

/** Calculate age from a date-of-birth string (yyyy-mm-dd). Returns null if invalid. */
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
	return age >= 0 && age < 130 ? age : null;
}

/** Estimate the EDD from the LMP using Naegele's rule (LMP + 280 days). */
export function calculateEdd(lmp: string): string {
	if (!lmp) return '';
	const d = new Date(lmp);
	if (isNaN(d.getTime())) return '';
	d.setDate(d.getDate() + 280);
	return d.toISOString().slice(0, 10);
}

/** Friendly label for an antenatal risk level. */
export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'high':
			return 'High Risk — Consultant-led / Multidisciplinary Care';
		case 'moderate':
			return 'Moderate Risk — Obstetric Input at Milestones';
		case 'low':
			return 'Low Risk — Midwifery-led Care';
	}
}

/** Short label for an antenatal risk level (used by the dashboard). */
export function riskLevelShortLabel(level: RiskLevel): string {
	switch (level) {
		case 'high':
			return 'High Risk';
		case 'moderate':
			return 'Moderate Risk';
		case 'low':
			return 'Low Risk';
	}
}

/** The recommended care pathway implied by a risk level. */
export function carePathwayLabel(level: RiskLevel): string {
	switch (level) {
		case 'high':
			return 'Consultant-led';
		case 'moderate':
			return 'Shared / Obstetric';
		case 'low':
			return 'Midwifery-led';
	}
}

/** Lily token colour triple for a risk level (used by Badge / report banner). */
export function riskLevelColor(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
	}
}
