import type {
	AgeBand,
	Avpu,
	CareSetting,
	ClinicianRole,
	Priority,
	RiskBand,
	Sex,
	Subscores
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low (MEWS 0-1)';
		case 'medium':
			return 'Medium (MEWS 2-4)';
		case 'high':
			return 'High (MEWS 5 or more)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * low → success; medium → warning; high → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a parameter subscore pill (0-3). */
export function subscoreColor(points: number | null): string {
	if (points === null) return 'bg-base-300 text-base-content border-base-300';
	if (points >= 3) return 'bg-error text-error-content border-error';
	if (points >= 1) return 'bg-warning text-warning-content border-warning';
	return 'bg-success text-success-content border-success';
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
		case 'nurse':
			return 'Nurse';
		case 'healthcare-assistant':
			return 'Healthcare assistant';
		case 'doctor':
			return 'Doctor';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'acute-ward':
			return 'Acute ward';
		case 'admissions-unit':
			return 'Admissions unit';
		case 'assessment-unit':
			return 'Assessment unit';
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

/** AVPU level-of-consciousness label. */
export function avpuLabel(avpu: Avpu): string {
	switch (avpu) {
		case 'alert':
			return 'Alert';
		case 'voice':
			return 'Responds to voice';
		case 'pain':
			return 'Responds to pain';
		case 'unresponsive':
			return 'Unresponsive';
		default:
			return '';
	}
}

/** Human-readable label for a single parameter subscore key. */
export function subscoreLabel(key: keyof Subscores): string {
	switch (key) {
		case 'systolicBloodPressure':
			return 'Systolic blood pressure';
		case 'heartRate':
			return 'Heart rate';
		case 'respiratoryRate':
			return 'Respiratory rate';
		case 'temperature':
			return 'Temperature';
		case 'avpu':
			return 'Consciousness (AVPU)';
		default:
			return '';
	}
}
