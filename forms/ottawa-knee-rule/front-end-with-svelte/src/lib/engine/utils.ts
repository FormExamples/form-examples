import type {
	CareSetting,
	ClinicianRole,
	Decision,
	InjuredSide,
	InjuryMechanism,
	Priority,
	Sex,
	YesNo
} from './types';

/** Imaging-decision label for display. */
export function decisionLabel(decision: Decision): string {
	switch (decision) {
		case 'xray-indicated':
			return 'X-ray indicated';
		case 'xray-not-indicated':
			return 'X-ray not indicated';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the decision badge/banner.
 * X-ray indicated → error; X-ray not indicated → success.
 */
export function decisionColor(decision: Decision): string {
	switch (decision) {
		case 'xray-indicated':
			return 'bg-error text-error-content border-error';
		case 'xray-not-indicated':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a single criterion state (present/absent). */
export function criterionColor(present: boolean): string {
	return present
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

/** Human label for each criterion slug. */
export function criterionLabel(criterion: string): string {
	switch (criterion) {
		case 'age':
			return 'Age 55 years or older';
		case 'isolated-patellar-tenderness':
			return 'Isolated patellar tenderness';
		case 'fibular-head-tenderness':
			return 'Fibular head tenderness';
		case 'flexion':
			return 'Unable to flex the knee to 90 degrees';
		case 'weight-bearing':
			return 'Unable to bear weight (four steps)';
		default:
			return '';
	}
}

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse-practitioner':
			return 'Emergency nurse practitioner';
		case 'physiotherapist':
			return 'Physiotherapy practitioner';
		case 'paramedic':
			return 'Paramedic';
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
		case 'minor-injuries-unit':
			return 'Minor-injuries unit';
		case 'urgent-care':
			return 'Urgent-care / walk-in centre';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Injury-mechanism label. */
export function injuryMechanismLabel(mechanism: InjuryMechanism): string {
	switch (mechanism) {
		case 'blunt-trauma':
			return 'Blunt trauma';
		case 'twisting':
			return 'Twisting';
		case 'fall':
			return 'Fall';
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

/** Injured-side label. */
export function injuredSideLabel(side: InjuredSide): string {
	switch (side) {
		case 'left':
			return 'Left';
		case 'right':
			return 'Right';
		default:
			return '';
	}
}

/** Yes/No label. */
export function yesNoLabel(v: YesNo): string {
	switch (v) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return 'Not recorded';
	}
}
