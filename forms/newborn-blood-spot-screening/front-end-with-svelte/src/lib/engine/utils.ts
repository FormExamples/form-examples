import type {
	CareSetting,
	OverallOutcome,
	Priority,
	ReferralStatus,
	ResultClass,
	SampleTakerRole,
	Sex
} from './types';

/** Human label for a per-condition result class. */
export function resultClassLabel(result: ResultClass): string {
	switch (result) {
		case 'not-suspected':
			return 'Not suspected';
		case 'suspected':
			return 'Suspected';
		case 'carrier':
			return 'Carrier';
		case 'repeat-required':
			return 'Repeat required';
		case 'declined':
			return 'Declined';
		case 'pending':
			return 'Pending';
		default:
			return 'Not recorded';
	}
}

/** Lily-token colour utility classes for a per-condition result pill. */
export function resultClassColor(result: ResultClass): string {
	switch (result) {
		case 'not-suspected':
			return 'bg-success text-success-content border-success';
		case 'suspected':
			return 'bg-error text-error-content border-error';
		case 'repeat-required':
			return 'bg-warning text-warning-content border-warning';
		case 'carrier':
			return 'bg-info text-info-content border-info';
		case 'declined':
			return 'bg-base-300 text-base-content border-base-300';
		case 'pending':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human label for the overall screening outcome. */
export function outcomeLabel(outcome: OverallOutcome): string {
	switch (outcome) {
		case 'all-not-suspected':
			return 'All conditions not suspected';
		case 'referral-required':
			return 'Referral required';
		case 'repeat-required':
			return 'Repeat sample required';
		case 'incomplete':
			return 'Incomplete — results outstanding';
		case 'declined-only-outstanding':
			return 'Complete — some conditions declined';
		default:
			return 'Not classified';
	}
}

/** Lily-token colour utility classes for the overall-outcome badge / banner. */
export function outcomeColor(outcome: OverallOutcome): string {
	switch (outcome) {
		case 'referral-required':
			return 'bg-error text-error-content border-error';
		case 'repeat-required':
			return 'bg-warning text-warning-content border-warning';
		case 'incomplete':
			return 'bg-warning text-warning-content border-warning';
		case 'declined-only-outstanding':
			return 'bg-info text-info-content border-info';
		case 'all-not-suspected':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human label for the referral status. */
export function referralStatusLabel(status: ReferralStatus): string {
	switch (status) {
		case 'urgent':
			return 'Urgent referral';
		case 'repeat':
			return 'Repeat sample';
		case 'routine':
			return 'Routine — no referral';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for the referral status. */
export function referralStatusColor(status: ReferralStatus): string {
	switch (status) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'repeat':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'urgent':
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

/** Sample-taker role label. */
export function sampleTakerRoleLabel(role: SampleTakerRole): string {
	switch (role) {
		case 'midwife':
			return 'Midwife';
		case 'health-visitor':
			return 'Health visitor';
		case 'neonatal-nurse':
			return 'Neonatal nurse';
		case 'laboratory':
			return 'Laboratory';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'community':
			return 'Community';
		case 'home':
			return 'Home';
		case 'neonatal-unit':
			return 'Neonatal unit';
		case 'hospital':
			return 'Hospital';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Baby-sex label. */
export function sexLabel(sex: Sex): string {
	switch (sex) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'indeterminate':
			return 'Indeterminate';
		case 'not-recorded':
			return 'Not recorded';
		default:
			return '';
	}
}
