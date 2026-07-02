import type {
	CareSetting,
	ClinicianRole,
	InjuredSide,
	Priority,
	Sex,
	YesNo
} from './types';

/** Imaging-decision label for display. */
export function decisionLabel(indicated: boolean): string {
	return indicated ? 'X-ray indicated' : 'X-ray not indicated';
}

/**
 * Lily-token colour utility classes for an imaging-decision badge/banner.
 * Indicated → error; not indicated → success.
 */
export function decisionColor(indicated: boolean): string {
	return indicated
		? 'bg-error text-error-content border-error'
		: 'bg-success text-success-content border-success';
}

/** Lily-token colour utility classes for the derived unable-to-bear-weight state. */
export function weightBearingColor(unable: boolean): string {
	return unable
		? 'bg-warning text-warning-content border-warning'
		: 'bg-success text-success-content border-success';
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
		case 'nurse-practitioner':
			return 'Nurse practitioner';
		case 'paramedic':
			return 'Paramedic';
		case 'physiotherapist':
			return 'Physiotherapist';
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
		case 'minor-injury-unit':
			return 'Minor-injury unit';
		case 'urgent-care':
			return 'Urgent care';
		case 'other':
			return 'Other';
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

/** A short summary label for the combined imaging decision. */
export function decisionSummaryLabel(ankle: boolean, foot: boolean): string {
	if (ankle && foot) return 'Ankle + foot X-ray';
	if (ankle) return 'Ankle X-ray only';
	if (foot) return 'Foot X-ray only';
	return 'No X-ray indicated';
}
