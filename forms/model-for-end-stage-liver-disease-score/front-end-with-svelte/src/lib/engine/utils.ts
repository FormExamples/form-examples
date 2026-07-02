import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	MeldVariant,
	MortalityBand,
	Priority,
	Sex
} from './types';

/** MELD variant label for display. */
export function meldVariantLabel(variant: MeldVariant): string {
	switch (variant) {
		case 'meld':
			return 'MELD (original)';
		case 'meld-na':
			return 'MELD-Na (sodium-corrected)';
		case 'meld-3':
			return 'MELD 3.0';
		default:
			return '';
	}
}

/** Mortality-band label for display. */
export function mortalityBandLabel(band: MortalityBand): string {
	switch (band) {
		case 'low':
			return 'Low (~2% 3-month mortality)';
		case 'moderate':
			return 'Moderate (~6% 3-month mortality)';
		case 'high':
			return 'High (~20% 3-month mortality)';
		case 'very-high':
			return 'Very high (~53% 3-month mortality)';
		case 'extreme':
			return 'Extreme (~71% 3-month mortality)';
		default:
			return 'Awaiting required inputs';
	}
}

/**
 * Lily-token colour utility classes for the mortality-band badge/banner.
 * low → success; moderate → warning; high / very-high / extreme → error.
 */
export function mortalityBandColor(band: MortalityBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
		case 'very-high':
		case 'extreme':
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
		case 'hepatologist':
			return 'Hepatologist';
		case 'gastroenterologist':
			return 'Gastroenterologist';
		case 'transplant-coordinator':
			return 'Transplant coordinator';
		case 'intensivist':
			return 'Intensivist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'hepatology-clinic':
			return 'Hepatology clinic';
		case 'transplant-unit':
			return 'Transplant unit';
		case 'intensive-care':
			return 'Intensive care';
		case 'ward':
			return 'Ward';
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
		case '16-39':
			return '16-39';
		case '40-59':
			return '40-59';
		case '60-74':
			return '60-74';
		case '75-plus':
			return '75 and over';
		default:
			return '';
	}
}

/** Format a MELD score for display, or a dash when null. */
export function formatScore(n: number | null): string {
	return n === null || n === undefined ? '—' : `MELD ${n}`;
}
