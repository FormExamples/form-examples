import type {
	CareSetting,
	CkdStage,
	ClinicianRole,
	DiabetesStatus,
	Ethnicity,
	Priority,
	RiskBand,
	Sex,
	SmokingStatus
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low / not raised (< 10%)';
		case 'raised':
			return 'Raised (>= 10%) — offer statin';
		case 'high':
			return 'High (>= 20%) — prioritise statin';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * Low → success; raised → warning; high → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'raised':
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
		case 'general-practice':
			return 'General practice';
		case 'pharmacy':
			return 'Community pharmacy';
		case 'nhs-health-check':
			return 'NHS Health Check';
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
		default:
			return '';
	}
}

/** Nine-category QRISK3 ethnicity label. */
export function ethnicityLabel(ethnicity: Ethnicity): string {
	switch (ethnicity) {
		case 'white-or-not-stated':
			return 'White or not stated';
		case 'indian':
			return 'Indian';
		case 'pakistani':
			return 'Pakistani';
		case 'bangladeshi':
			return 'Bangladeshi';
		case 'other-asian':
			return 'Other Asian';
		case 'black-caribbean':
			return 'Black Caribbean';
		case 'black-african':
			return 'Black African';
		case 'chinese':
			return 'Chinese';
		case 'other':
			return 'Other ethnic group';
		default:
			return '';
	}
}

/** Smoking-status label. */
export function smokingLabel(status: SmokingStatus): string {
	switch (status) {
		case 'non':
			return 'Non-smoker';
		case 'ex':
			return 'Ex-smoker';
		case 'light':
			return 'Light smoker (< 10/day)';
		case 'moderate':
			return 'Moderate smoker (10-19/day)';
		case 'heavy':
			return 'Heavy smoker (>= 20/day)';
		default:
			return '';
	}
}

/** Diabetes-status label. */
export function diabetesLabel(status: DiabetesStatus): string {
	switch (status) {
		case 'none':
			return 'No diabetes';
		case 'type1':
			return 'Type 1 diabetes';
		case 'type2':
			return 'Type 2 diabetes';
		default:
			return '';
	}
}

/** Chronic-kidney-disease stage label. */
export function ckdStageLabel(stage: CkdStage): string {
	switch (stage) {
		case 'none':
			return 'No CKD';
		case 'stage3':
			return 'CKD stage 3';
		case 'stage4':
			return 'CKD stage 4';
		case 'stage5':
			return 'CKD stage 5';
		default:
			return '';
	}
}
