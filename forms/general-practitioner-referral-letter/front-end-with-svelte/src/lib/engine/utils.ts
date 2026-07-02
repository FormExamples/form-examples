import type {
	ConsentToShare,
	PatientSex,
	Priority,
	ReferrerRole,
	Status,
	Urgency
} from './types';

/** Completeness-status label for display. */
export function statusLabel(status: Status): string {
	switch (status) {
		case 'Complete':
			return 'Complete';
		case 'Incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the status badge/banner.
 * Complete → success; incomplete → error.
 */
export function statusColor(status: Status): string {
	switch (status) {
		case 'Complete':
			return 'bg-success text-success-content border-success';
		case 'Incomplete':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Urgency-classification label for display. */
export function urgencyLabel(urgency: Urgency): string {
	switch (urgency) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week-wait (suspected cancer)';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not set';
	}
}

/**
 * Lily-token colour utility classes for the urgency badge/banner.
 * Routine → success; urgent → warning; two-week-wait → error; emergency → error.
 */
export function urgencyColor(urgency: Urgency): string {
	switch (urgency) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'two-week-wait':
			return 'bg-error text-error-content border-error';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Pathway text for an urgency classification. */
export function urgencyPathway(urgency: Urgency): string {
	switch (urgency) {
		case 'routine':
			return 'Routine outpatient referral — book via e-RS within the service’s standard routine timescales.';
		case 'urgent':
			return 'Urgent referral — flag to the receiving service for prioritised, non-cancer urgent assessment; record why it is urgent.';
		case 'two-week-wait':
			return 'Suspected-cancer (two-week-wait) pathway — route on the NICE NG12 two-week-wait pathway; name the criterion and tumour-site pathway so the patient is seen within two weeks.';
		case 'emergency':
			return 'Emergency — arrange same-day assessment or call 999 / acute admission now; do not send this as a routine letter.';
		default:
			return 'Select an urgency so the referral can be routed.';
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

/** Referrer-role label. */
export function referrerRoleLabel(value: ReferrerRole): string {
	switch (value) {
		case 'gp':
			return 'GP';
		case 'gp-registrar':
			return 'GP registrar';
		case 'nurse-practitioner':
			return 'Nurse practitioner';
		case 'pharmacist':
			return 'Pharmacist';
		case 'paramedic':
			return 'Paramedic';
		case 'other':
			return 'Other';
		default:
			return 'Not recorded';
	}
}

/** Patient-sex label. */
export function patientSexLabel(value: PatientSex): string {
	switch (value) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'other':
			return 'Other';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Consent-to-share label. */
export function consentToShareLabel(value: ConsentToShare): string {
	switch (value) {
		case 'yes':
			return 'Consent documented';
		case 'no':
			return 'Consent not given';
		default:
			return 'Not recorded';
	}
}
