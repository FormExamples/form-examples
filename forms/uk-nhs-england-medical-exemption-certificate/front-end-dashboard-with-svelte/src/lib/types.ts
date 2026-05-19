/** Application row displayed in the FP92A practitioner dashboard. */
export interface ApplicationRow {
	id: string;
	certificateNumber: string;
	patientName: string;
	nhsNumber: string;
	patientDateOfBirth: string;
	practitionerName: string;
	conditions: string[];
	outcome: 'eligible' | 'ineligible' | 'requires-clarification' | '';
	status: 'draft' | 'ready-to-post' | 'posted' | 'issued' | 'rejected' | 'expired' | 'cancelled' | '';
	validFrom: string;
	validUntil: string;
	flagCount: number;
	createdAt: string;
}

/** Response from GET /api/dashboard/applications */
export interface DashboardApplicationsResponse {
	items: ApplicationRow[];
	total: number;
}

export const CONDITION_LABELS: Record<string, string> = {
	'permanent-fistula': 'Permanent fistula',
	'hypoadrenalism': 'Hypoadrenalism',
	'diabetes-insipidus-or-hypopituitarism': 'Diabetes insipidus / hypopituitarism',
	'diabetes-mellitus-not-diet-only': 'Diabetes mellitus',
	'hypoparathyroidism': 'Hypoparathyroidism',
	'myasthenia-gravis': 'Myasthenia gravis',
	'myxoedema': 'Myxoedema',
	'epilepsy-on-anticonvulsant': 'Epilepsy',
	'continuing-physical-disability': 'Continuing physical disability',
	'cancer-or-effects': 'Cancer-related'
};

export const OUTCOME_LABELS: Record<string, string> = {
	'eligible': 'Eligible',
	'ineligible': 'Ineligible',
	'requires-clarification': 'Requires clarification'
};

export const STATUS_LABELS: Record<string, string> = {
	'draft': 'Draft',
	'ready-to-post': 'Ready to post',
	'posted': 'Posted',
	'issued': 'Issued',
	'rejected': 'Rejected',
	'expired': 'Expired',
	'cancelled': 'Cancelled'
};
