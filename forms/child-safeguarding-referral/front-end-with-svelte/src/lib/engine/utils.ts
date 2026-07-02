import type {
	ChildSex,
	ConsentStatus,
	PrimaryCategory,
	Priority,
	SharingBasis,
	Status,
	Urgency,
	YesNo,
	YesNoUnknown
} from './types';

/** Completeness-status label for display. */
export function statusLabel(status: Status): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'partial':
			return 'Partial';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the status badge/banner.
 * Complete → success; partial → warning; incomplete → error.
 */
export function statusColor(status: Status): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'partial':
			return 'bg-warning text-warning-content border-warning';
		case 'incomplete':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Urgency-classification label for display. */
export function urgencyLabel(urgency: Urgency): string {
	switch (urgency) {
		case 'emergency':
			return 'Emergency';
		case 'urgent':
			return 'Urgent (s47)';
		case 'standard':
			return 'Standard (s17)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the urgency badge/banner.
 * Emergency → error; urgent → warning; standard → success.
 */
export function urgencyColor(urgency: Urgency): string {
	switch (urgency) {
		case 'emergency':
			return 'bg-error text-error-content border-error';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'standard':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Statutory pathway text for an urgency classification. */
export function urgencyPathway(urgency: Urgency): string {
	switch (urgency) {
		case 'emergency':
			return 'Children Act 1989 s47 + emergency services — phone social care and police (999) now; do not wait for the written referral.';
		case 'urgent':
			return 'Children Act 1989 s47 enquiry — contact children’s social care the same working day.';
		case 'standard':
			return 'Children Act 1989 s17 assessment — standard written referral within agreed local timescales.';
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

/** Primary-category label. */
export function primaryCategoryLabel(value: PrimaryCategory): string {
	switch (value) {
		case 'physical':
			return 'Physical abuse';
		case 'emotional':
			return 'Emotional abuse';
		case 'sexual':
			return 'Sexual abuse';
		case 'neglect':
			return 'Neglect';
		default:
			return 'Not recorded';
	}
}

/** Consent-status label. */
export function consentStatusLabel(value: ConsentStatus): string {
	switch (value) {
		case 'given':
			return 'Consent given';
		case 'refused':
			return 'Consent refused';
		case 'not-sought':
			return 'Consent not sought';
		default:
			return 'Not recorded';
	}
}

/** Lawful-basis-for-sharing-without-consent label. */
export function sharingBasisLabel(value: SharingBasis): string {
	switch (value) {
		case 'risk-of-serious-harm':
			return 'Risk of serious harm';
		case 'seeking-consent-increases-risk':
			return 'Seeking consent would increase risk';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Not recorded';
	}
}

/** Child-sex label. */
export function childSexLabel(value: ChildSex): string {
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

/** Yes / No label. */
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

/** Yes / No / Unknown label. */
export function yesNoUnknownLabel(value: YesNoUnknown): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}
