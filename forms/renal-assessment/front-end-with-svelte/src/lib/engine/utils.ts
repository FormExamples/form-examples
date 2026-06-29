import type { GfrCategory, AlbuminuriaCategory, RiskLevel, Sex } from './types';

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

/** Calculate age in completed years from a date-of-birth string (YYYY-MM-DD). */
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
	return age >= 0 ? age : null;
}

/**
 * Estimate GFR via the CKD-EPI 2021 race-free equation.
 *  - serumCreatinine in mg/dL
 *  - age in years
 *  - sex 'male' | 'female' | 'other' (other treated as female)
 * Returns mL/min/1.73 m² rounded to one decimal, or null if inputs are invalid.
 */
export function estimateEgfrCkdEpi2021(
	serumCreatinine: number | null,
	age: number | null,
	sex: Sex
): number | null {
	if (!serumCreatinine || serumCreatinine <= 0) return null;
	if (!age || age <= 0) return null;
	const isFemale = sex === 'female' || sex === 'other';
	const k = isFemale ? 0.7 : 0.9;
	const alpha = isFemale ? -0.241 : -0.302;
	const sexFactor = isFemale ? 1.012 : 1.0;
	const scrK = serumCreatinine / k;
	const minTerm = Math.pow(Math.min(scrK, 1), alpha);
	const maxTerm = Math.pow(Math.max(scrK, 1), -1.2);
	const ageTerm = Math.pow(0.9938, age);
	const egfr = 142 * minTerm * maxTerm * ageTerm * sexFactor;
	return Math.round(egfr * 10) / 10;
}

/** Map an eGFR (mL/min/1.73 m²) to a KDIGO GFR category. */
export function classifyGfrCategory(egfr: number | null): GfrCategory {
	if (egfr === null) return '';
	if (egfr >= 90) return 'G1';
	if (egfr >= 60) return 'G2';
	if (egfr >= 45) return 'G3a';
	if (egfr >= 30) return 'G3b';
	if (egfr >= 15) return 'G4';
	return 'G5';
}

/** Map a urine ACR (mg/mmol) to a KDIGO albuminuria category. */
export function classifyAlbuminuriaCategory(acr: number | null): AlbuminuriaCategory {
	if (acr === null) return '';
	if (acr < 3) return 'A1';
	if (acr <= 30) return 'A2';
	return 'A3';
}

/** Friendly label for a GFR category. */
export function gfrCategoryLabel(g: GfrCategory): string {
	switch (g) {
		case 'G1':
			return 'G1: Normal or high (≥90)';
		case 'G2':
			return 'G2: Mildly decreased (60-89)';
		case 'G3a':
			return 'G3a: Mild to moderately decreased (45-59)';
		case 'G3b':
			return 'G3b: Moderately to severely decreased (30-44)';
		case 'G4':
			return 'G4: Severely decreased (15-29)';
		case 'G5':
			return 'G5: Kidney failure (<15)';
		default:
			return '';
	}
}

/** Friendly label for an albuminuria category. */
export function albuminuriaCategoryLabel(a: AlbuminuriaCategory): string {
	switch (a) {
		case 'A1':
			return 'A1: Normal to mildly increased (<3 mg/mmol)';
		case 'A2':
			return 'A2: Moderately increased (3-30 mg/mmol)';
		case 'A3':
			return 'A3: Severely increased (>30 mg/mmol)';
		default:
			return '';
	}
}

/** Human-readable label for the KDIGO composite risk level. */
export function riskLevelLabel(risk: RiskLevel): string {
	switch (risk) {
		case 'low':
			return 'Low risk';
		case 'moderate':
			return 'Moderately increased risk';
		case 'high':
			return 'High risk';
		case 'very-high':
			return 'Very high risk';
		default:
			return 'Insufficient data';
	}
}

/** Lily-token colour classes for the KDIGO composite risk level. */
export function riskLevelColor(risk: RiskLevel): string {
	switch (risk) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'very-high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
