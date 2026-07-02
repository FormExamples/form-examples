import type {
	Band,
	CareSetting,
	CarerCoResident,
	CarerRelationship,
	InstrumentForm,
	PractitionerRole,
	Priority,
	RecipientCondition
} from './types';

/** Interpretation-band label for display. */
export function bandLabel(band: Band): string {
	switch (band) {
		case 'little-or-none':
			return 'Little or no burden (0-21)';
		case 'mild-to-moderate':
			return 'Mild to moderate burden (22-40)';
		case 'moderate-to-severe':
			return 'Moderate to severe burden (41-60)';
		case 'severe':
			return 'Severe burden (61-88)';
		case 'lower':
			return 'Lower burden (0-16)';
		case 'high':
			return 'High burden (>= 17)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the band badge/banner.
 * little-or-none / lower → success; mild-to-moderate → warning;
 * moderate-to-severe / severe / high → error.
 */
export function bandColor(band: Band): string {
	switch (band) {
		case 'little-or-none':
		case 'lower':
			return 'bg-success text-success-content border-success';
		case 'mild-to-moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'moderate-to-severe':
		case 'severe':
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a single item rating pill (0..4). */
export function itemRatingColor(rating: number): string {
	if (rating >= 3) return 'bg-error text-error-content border-error';
	if (rating >= 1) return 'bg-warning text-warning-content border-warning';
	return 'bg-base-300 text-base-content border-base-300';
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
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
		case 'urgent':
			return 'URGENT';
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

/** Administering-practitioner role label. */
export function practitionerRoleLabel(role: PractitionerRole): string {
	switch (role) {
		case 'clinician':
			return 'Clinician';
		case 'nurse':
			return 'Nurse';
		case 'social-care':
			return 'Social-care practitioner';
		case 'carer-support':
			return 'Carer-support worker';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'memory-service':
			return 'Old-age / memory service';
		case 'community':
			return 'Community / district nursing';
		case 'general-practice':
			return 'General practice';
		case 'social-care':
			return 'Social care / carer support';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Instrument-form label. */
export function instrumentFormLabel(form: InstrumentForm): string {
	switch (form) {
		case 'zbi22':
			return 'ZBI-22 (full, 22 items, 0-88)';
		case 'zbi12':
			return 'ZBI-12 (short form, 12 items, 0-48)';
		default:
			return '';
	}
}

/** Carer-relationship label. */
export function carerRelationshipLabel(rel: CarerRelationship): string {
	switch (rel) {
		case 'spouse-partner':
			return 'Spouse / partner';
		case 'adult-child':
			return 'Adult child';
		case 'other-relative':
			return 'Other relative';
		case 'friend':
			return 'Friend';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Carer co-resident label. */
export function carerCoResidentLabel(value: CarerCoResident): string {
	switch (value) {
		case 'yes':
			return 'Yes — lives with the care recipient';
		case 'no':
			return 'No — does not live with the care recipient';
		default:
			return '';
	}
}

/** Care-recipient condition label. */
export function recipientConditionLabel(cond: RecipientCondition): string {
	switch (cond) {
		case 'dementia':
			return 'Dementia';
		case 'chronic-illness':
			return 'Chronic illness';
		case 'disability':
			return 'Disability';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}
