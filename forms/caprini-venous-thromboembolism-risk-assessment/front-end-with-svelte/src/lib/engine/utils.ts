import type {
	AdmissionType,
	AgeBand,
	CareSetting,
	ClinicianRole,
	Priority,
	Prophylaxis,
	RiskBand,
	Sex,
	WeightGroup
} from './types';

/** Age-band point weights (spec §4). */
export const ageBandPoints: Record<Exclude<AgeBand, ''>, number> = {
	'under-41': 0,
	'41-60': 1,
	'61-74': 2,
	'75-plus': 3
};

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'very-low':
			return 'Very low risk (Caprini 0-1)';
		case 'low':
			return 'Low risk (Caprini 2)';
		case 'moderate':
			return 'Moderate risk (Caprini 3-4)';
		case 'high':
			return 'High risk (Caprini 5+)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * Very low → success; low → info; moderate → warning; high → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
		case 'very-low':
			return 'bg-success text-success-content border-success';
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

/** Lily-token colour utility classes for a fired-factor points pill. */
export function pointsColor(points: number): string {
	return points > 0
		? 'bg-warning text-warning-content border-warning'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Recommended-prophylaxis label for display. */
export function recommendedProphylaxisLabel(rec: Prophylaxis): string {
	switch (rec) {
		case 'early-ambulation':
			return 'Early ambulation — no specific mechanical or pharmacological prophylaxis';
		case 'mechanical':
			return 'Mechanical prophylaxis (intermittent pneumatic compression and/or graduated compression stockings)';
		case 'pharmacological-or-mechanical':
			return 'Pharmacological prophylaxis (LMWH or low-dose unfractionated heparin) or mechanical prophylaxis; consider combining';
		case 'pharmacological-plus-mechanical':
			return 'Pharmacological prophylaxis plus mechanical prophylaxis; consider extended-duration prophylaxis';
		default:
			return '';
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
		case 'surgeon':
			return 'Surgeon';
		case 'nurse':
			return 'Nurse';
		case 'pharmacist':
			return 'Pharmacist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'surgical-ward':
			return 'Surgical ward';
		case 'medical-ward':
			return 'Medical ward';
		case 'pre-operative-clinic':
			return 'Pre-operative clinic';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Admission-type label. */
export function admissionTypeLabel(type: AdmissionType): string {
	switch (type) {
		case 'surgical':
			return 'Surgical';
		case 'medical':
			return 'Medical';
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
		case 'under-41':
			return 'Under 41';
		case '41-60':
			return '41-60 (1 point)';
		case '61-74':
			return '61-74 (2 points)';
		case '75-plus':
			return '75 and over (3 points)';
		default:
			return '';
	}
}

/** Weight-group label. */
export function weightGroupLabel(group: WeightGroup): string {
	switch (group) {
		case 'age':
			return 'Age band';
		case '1-point':
			return '1 point';
		case '2-point':
			return '2 points';
		case '3-point':
			return '3 points';
		case '5-point':
			return '5 points';
		default:
			return '';
	}
}
