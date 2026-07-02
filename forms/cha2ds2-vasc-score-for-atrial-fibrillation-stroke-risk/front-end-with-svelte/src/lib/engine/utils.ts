import type {
	AnticoagulationRecommendation,
	AtrialFibrillationType,
	CareSetting,
	ClinicianRole,
	Priority,
	RiskBand,
	Sex
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low risk';
		case 'intermediate':
			return 'Intermediate risk';
		case 'high':
			return 'High risk';
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

/** Lily-token colour utility classes for a criterion point pill (>0 = warning). */
export function pointColor(point: number): string {
	return point > 0
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

/** Anticoagulation-recommendation label. */
export function anticoagulationLabel(rec: AnticoagulationRecommendation): string {
	switch (rec) {
		case 'none':
			return 'No antithrombotic therapy recommended';
		case 'consider':
			return 'Consider oral anticoagulation';
		case 'recommended':
			return 'Oral anticoagulation recommended';
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
		case 'cardiology':
			return 'Cardiology / arrhythmia clinic';
		case 'anticoagulation-clinic':
			return 'Anticoagulation clinic';
		case 'emergency-department':
			return 'Emergency department';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Atrial-fibrillation-type label. */
export function atrialFibrillationTypeLabel(type: AtrialFibrillationType): string {
	switch (type) {
		case 'paroxysmal':
			return 'Paroxysmal';
		case 'persistent':
			return 'Persistent';
		case 'permanent':
			return 'Permanent';
		case 'flutter':
			return 'Atrial flutter';
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
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Derived age-band label from age in years. */
export function ageBandLabel(ageYears: number | null): string {
	if (ageYears === null || ageYears === undefined) return '';
	if (ageYears >= 75) return 'Age 75 and over (2 points)';
	if (ageYears >= 65) return 'Age 65-74 (1 point)';
	return 'Age under 65 (0 points)';
}
