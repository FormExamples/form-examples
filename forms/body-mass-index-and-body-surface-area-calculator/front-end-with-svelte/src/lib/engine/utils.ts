import type {
	AgeBand,
	Ancestry,
	BmiCategory,
	BsaFormula,
	CareSetting,
	ClinicianRole,
	Priority,
	Purpose,
	Sex
} from './types';

/** WHO BMI category label for display. */
export function bmiCategoryLabel(category: BmiCategory): string {
	switch (category) {
		case 'underweight':
			return 'Underweight (< 18.5)';
		case 'normal':
			return 'Normal (18.5-24.9)';
		case 'overweight':
			return 'Overweight (25.0-29.9)';
		case 'obese-class-1':
			return 'Obese class I (30.0-34.9)';
		case 'obese-class-2':
			return 'Obese class II (35.0-39.9)';
		case 'obese-class-3':
			return 'Obese class III (≥ 40.0)';
		default:
			return 'Awaiting height and weight';
	}
}

/**
 * Lily-token colour utility classes for the category badge/banner.
 * Normal → success; underweight/overweight → warning; obese → error.
 */
export function bmiCategoryColor(category: BmiCategory): string {
	switch (category) {
		case 'normal':
			return 'bg-success text-success-content border-success';
		case 'underweight':
		case 'overweight':
			return 'bg-warning text-warning-content border-warning';
		case 'obese-class-1':
		case 'obese-class-2':
		case 'obese-class-3':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'HIGH';
		case 'medium':
			return 'MEDIUM';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'pharmacist':
			return 'Pharmacist';
		case 'dietitian':
			return 'Dietitian';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'primary-care':
			return 'Primary care';
		case 'outpatient':
			return 'Outpatient';
		case 'inpatient':
			return 'Inpatient';
		case 'oncology':
			return 'Oncology';
		case 'pre-operative':
			return 'Pre-operative';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Purpose label. */
export function purposeLabel(purpose: Purpose): string {
	switch (purpose) {
		case 'screening':
			return 'Screening';
		case 'drug-dosing':
			return 'Drug dosing';
		case 'monitoring':
			return 'Monitoring';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Patient-sex label. */
export function sexLabel(sex: Sex): string {
	switch (sex) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'intersex':
			return 'Intersex';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Adult age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case '18-39':
			return '18-39';
		case '40-64':
			return '40-64';
		case '65-74':
			return '65-74';
		case '75-84':
			return '75-84';
		case '85-plus':
			return '85 and over';
		default:
			return '';
	}
}

/** Ancestry label (drives the Asian lower-threshold action points). */
export function ancestryLabel(ancestry: Ancestry): string {
	switch (ancestry) {
		case 'asian':
			return 'Asian ancestry';
		case 'other':
			return 'Other ancestry';
		case 'unspecified':
			return 'Unspecified';
		default:
			return '';
	}
}

/** Preferred BSA-formula label. */
export function bsaFormulaLabel(formula: BsaFormula): string {
	switch (formula) {
		case 'mosteller':
			return 'Mosteller';
		case 'du-bois':
			return 'Du Bois';
		default:
			return '';
	}
}

/** Format a BMI value for display, or a dash when null. */
export function formatBmi(n: number | null): string {
	return n === null || n === undefined ? '—' : `${n.toFixed(1)} kg/m²`;
}

/** Format a BSA value for display, or a dash when null. */
export function formatBsa(n: number | null): string {
	return n === null || n === undefined ? '—' : `${n.toFixed(2)} m²`;
}
