import type {
	CareSetting,
	ClinicianRole,
	Priority,
	RiskBand,
	Sex,
	WorkingDiagnosis
} from './types';

/**
 * 14-day composite-event risk (%) looked up by total TIMI score (0-7).
 * The composite end point is all-cause death, new or recurrent MI, or severe
 * recurrent ischaemia prompting urgent revascularisation (Antman, JAMA 2000).
 */
export const FOURTEEN_DAY_RISK_PERCENT: Record<number, number> = {
	0: 4.7,
	1: 4.7,
	2: 8.3,
	3: 13.2,
	4: 19.9,
	5: 26.2,
	6: 40.9,
	7: 40.9
};

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low risk (TIMI 0-1)';
		case 'intermediate':
			return 'Intermediate risk (TIMI 2-4)';
		case 'high':
			return 'High risk (TIMI 5-7)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * Low → success; intermediate → warning; high → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'intermediate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a criterion point pill (1 = warning). */
export function pointColor(point: 0 | 1): string {
	return point === 1
		? 'bg-warning text-warning-content border-warning'
		: 'bg-base-300 text-base-content border-base-300';
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
		case 'physician':
			return 'Physician';
		case 'cardiologist':
			return 'Cardiologist';
		case 'nurse-practitioner':
			return 'Nurse practitioner';
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
		case 'chest-pain-unit':
			return 'Chest-pain unit';
		case 'ward':
			return 'Ward';
		case 'coronary-care':
			return 'Coronary-care unit';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Working-diagnosis label. */
export function workingDiagnosisLabel(dx: WorkingDiagnosis): string {
	switch (dx) {
		case 'unstable-angina':
			return 'Unstable angina';
		case 'nstemi':
			return 'NSTEMI';
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
