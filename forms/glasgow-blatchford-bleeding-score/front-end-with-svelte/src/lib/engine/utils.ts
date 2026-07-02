import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	PresentingComplaint,
	Priority,
	RiskBand,
	Sex,
	YesNo
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand | ''): string {
	switch (band) {
		case 'very-low':
			return 'Very low risk';
		case 'low-moderate':
			return 'Low-moderate risk';
		case 'high':
			return 'High risk';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk badge/banner.
 * very-low → success; low-moderate → warning; high → error.
 */
export function riskBandColor(band: RiskBand | ''): string {
	switch (band) {
		case 'very-low':
			return 'bg-success text-success-content border-success';
		case 'low-moderate':
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
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		case 'info':
			return 'bg-info text-info-content border-info';
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
		case 'info':
			return 'INFO';
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
		case 'advanced-practitioner':
			return 'Advanced practitioner';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'emergency-department':
			return 'Emergency department';
		case 'acute-medical-unit':
			return 'Acute medical unit';
		case 'ward':
			return 'Ward';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Presenting-complaint label. */
export function presentingComplaintLabel(complaint: PresentingComplaint): string {
	switch (complaint) {
		case 'haematemesis':
			return 'Haematemesis';
		case 'coffee-ground':
			return 'Coffee-ground vomiting';
		case 'melaena':
			return 'Melaena';
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

/** Yes/No enum label. */
export function yesNoLabel(value: YesNo): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return '';
	}
}

/** Format a per-parameter point contribution as "N pt". */
export function formatPoint(points: number): string {
	return `${points} pt`;
}

/** Format a Glasgow-Blatchford total, appending "(partial)" while incomplete. */
export function formatScore(score: number, complete: boolean): string {
	return `${score}${complete ? '' : ' (partial)'}`;
}
