import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	CompletenessStatus,
	Priority,
	RiskLevel,
	Sex
} from './types';

/** Completeness-status label for display. */
export function statusLabel(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'partial':
			return 'Partial';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the completeness-status badge/banner.
 * complete → success (nothing outstanding); partial → warning (domains
 * outstanding).
 */
export function statusColor(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'partial':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Risk-level label for display. */
export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'none':
			return 'No risk flags';
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-level badge/banner.
 * none → base-300; low → info; moderate → warning; high → error.
 */
export function riskLevelColor(level: RiskLevel): string {
	switch (level) {
		case 'none':
			return 'bg-base-300 text-base-content border-base-300';
		case 'low':
			return 'bg-info text-info-content border-info';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
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
		case 'moderate':
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
		case 'moderate':
			return 'MODERATE';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for a per-domain documented pill. */
export function documentedColor(documented: boolean): string {
	return documented
		? 'bg-success text-success-content border-success'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'psychiatrist':
			return 'Psychiatrist';
		case 'mental-health-nurse':
			return 'Mental-health nurse';
		case 'gp':
			return 'General practitioner';
		case 'liaison':
			return 'Liaison-psychiatry clinician';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'outpatient':
			return 'Outpatient clinic';
		case 'inpatient':
			return 'Inpatient ward';
		case 'liaison':
			return 'Liaison psychiatry';
		case 'crisis':
			return 'Crisis / home treatment';
		case 'primary-care':
			return 'Primary care';
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

/** Age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case 'under-18':
			return 'Under 18';
		case '18-25':
			return '18-25';
		case '26-39':
			return '26-39';
		case '40-64':
			return '40-64';
		case '65-plus':
			return '65 and over';
		default:
			return '';
	}
}

/**
 * Human-readable label for a domain finding value. The MSE stores enum values
 * as kebab-case tokens; this converts an unrecognised token to a Title Case
 * phrase so the report and dashboard render sensibly without a lookup per
 * field. A blank value returns 'Not recorded'.
 */
export function findingLabel(value: string): string {
	if (!value || value.trim() === '') return 'Not recorded';
	return value
		.split('-')
		.map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
		.join(' ');
}
