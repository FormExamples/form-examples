import type {
	AdministrationMode,
	AgeBand,
	CareSetting,
	ClinicianRole,
	ItemOption,
	Priority,
	RiskBand,
	Sex
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'lower':
			return 'Lower risk (0-4)';
		case 'increasing':
			return 'Increasing risk (5-7)';
		case 'higher':
			return 'Higher risk (8-10)';
		case 'possible-dependence':
			return 'Possible dependence (11-12)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * lower → success; increasing → warning; higher → error; dependence → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
		case 'lower':
			return 'bg-success text-success-content border-success';
		case 'increasing':
			return 'bg-warning text-warning-content border-warning';
		case 'higher':
			return 'bg-error text-error-content border-error';
		case 'possible-dependence':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a 0-4 item point pill. */
export function pointColor(point: number): string {
	if (point >= 3) return 'bg-error text-error-content border-error';
	if (point >= 1) return 'bg-warning text-warning-content border-warning';
	return 'bg-base-300 text-base-content border-base-300';
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
		case 'gp':
			return 'General practitioner';
		case 'nurse':
			return 'Nurse';
		case 'healthcare-assistant':
			return 'Healthcare assistant';
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
		case 'emergency-department':
			return 'Emergency department';
		case 'health-check':
			return 'Health check';
		case 'inpatient':
			return 'Inpatient';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Administration-mode label. */
export function administrationModeLabel(mode: AdministrationMode): string {
	switch (mode) {
		case 'self-completed':
			return 'Self-completed';
		case 'interview':
			return 'Clinician interview';
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
		case '16-24':
			return '16-24';
		case '25-39':
			return '25-39';
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

/** Short label for an item key (used in the report table). */
export function itemLabel(item: string): string {
	switch (item) {
		case 'frequency-of-drinking':
			return 'Q1 — Frequency of drinking';
		case 'typical-quantity':
			return 'Q2 — Typical quantity (UK units)';
		case 'heavy-episode-frequency':
			return 'Q3 — Heavy episodic drinking';
		default:
			return '';
	}
}

// ──────────────────────────────────────────────
// AUDIT-C response options (0-4 per item)
// ──────────────────────────────────────────────

/** Q1 — how often you have a drink containing alcohol. */
export const FREQUENCY_OPTIONS: ItemOption[] = [
	{ value: 0, label: 'Never' },
	{ value: 1, label: 'Monthly or less' },
	{ value: 2, label: '2-4 times a month' },
	{ value: 3, label: '2-3 times a week' },
	{ value: 4, label: '4 or more times a week' }
];

/** Q2 — UK units on a typical day when drinking. */
export const QUANTITY_OPTIONS: ItemOption[] = [
	{ value: 0, label: '1-2 units' },
	{ value: 1, label: '3-4 units' },
	{ value: 2, label: '5-6 units' },
	{ value: 3, label: '7-9 units' },
	{ value: 4, label: '10 or more units' }
];

/** Q3 — frequency of >= 6 (female) / >= 8 (male) units in one session. */
export const HEAVY_EPISODE_OPTIONS: ItemOption[] = [
	{ value: 0, label: 'Never' },
	{ value: 1, label: 'Less than monthly' },
	{ value: 2, label: 'Monthly' },
	{ value: 3, label: 'Weekly' },
	{ value: 4, label: 'Daily or almost daily' }
];

/** Look up the display label for a chosen item value (or '—' when unanswered). */
export function optionLabel(options: ItemOption[], value: number | null): string {
	if (value === null) return '—';
	return options.find((o) => o.value === value)?.label ?? '—';
}
