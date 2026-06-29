import type { UKMECCategory } from './types';

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

/**
 * UKMEC category label.
 *   1 = No restriction (method can be used in any circumstances)
 *   2 = Advantages outweigh risks (method can generally be used)
 *   3 = Risks outweigh advantages (method not usually recommended)
 *   4 = Unacceptable health risk (method should not be used)
 */
export function ukmecCategory(category: UKMECCategory): string {
	switch (category) {
		case 1:
			return 'No restriction';
		case 2:
			return 'Advantages outweigh risks';
		case 3:
			return 'Risks outweigh advantages';
		case 4:
			return 'Unacceptable health risk';
	}
}

/** UKMEC category label for display. */
export function ukmecLabel(category: UKMECCategory): string {
	return `UKMEC ${category} - ${ukmecCategory(category)}`;
}

/** UKMEC category colour class. */
export function ukmecColor(category: UKMECCategory): string {
	switch (category) {
		case 1:
			return 'bg-success text-success-content border-success';
		case 2:
			return 'bg-info text-info-content border-info';
		case 3:
			return 'bg-warning text-warning-content border-warning';
		case 4:
			return 'bg-error text-error-content border-error';
	}
}

/** Calculate BMI from weight (kg) and height (m). */
export function bmiCalculation(weightKg: number, heightM: number): number | null {
	if (!weightKg || !heightM || heightM <= 0) return null;
	return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}
