import type {
	ClinicianRole,
	EligibilityStatus,
	EpisodeType,
	ImagingClassification,
	OutcomeBand,
	Priority,
	ReadingOutcome,
	ScreeningOutcome
} from './types';

/** Eligibility-status label for display. */
export function eligibilityLabel(status: EligibilityStatus): string {
	switch (status) {
		case 'eligible':
			return 'Eligible for routine screening';
		case 'outside-age-range':
			return 'Outside eligible age range';
		case 'higher-risk-surveillance':
			return 'Higher-risk surveillance pathway';
		case 'symptomatic-referral':
			return 'Symptomatic — refer to breast pathway';
		default:
			return '';
	}
}

/** Reading-outcome label. */
export function readingOutcomeLabel(outcome: ReadingOutcome): string {
	switch (outcome) {
		case 'normal-routine-recall':
			return 'Normal — routine recall';
		case 'technical-repeat':
			return 'Technical repeat';
		case 'recall-for-assessment':
			return 'Recall for assessment';
		default:
			return 'Not recorded';
	}
}

/** Five-point breast imaging classification label. */
export function imagingClassLabel(cls: ImagingClassification): string {
	switch (cls) {
		case 1:
			return '1 — Normal';
		case 2:
			return '2 — Benign';
		case 3:
			return '3 — Indeterminate / probably benign';
		case 4:
			return '4 — Suspicious';
		case 5:
			return '5 — Malignant';
		default:
			return 'Not assessed';
	}
}

/** Screening-outcome / next-action label. */
export function screeningOutcomeLabel(outcome: ScreeningOutcome): string {
	switch (outcome) {
		case 'routine-recall':
			return 'Routine 3-yearly recall';
		case 'technical-repeat':
			return 'Technical repeat mammogram';
		case 'recall-to-assessment-clinic':
			return 'Recall to assessment clinic';
		case 'short-interval-follow-up':
			return 'Short-interval follow-up';
		case 'urgent-breast-clinic':
			return 'Urgent breast-clinic referral';
		case 'symptomatic-pathway-referral':
			return 'Symptomatic-pathway referral';
		default:
			return 'Outcome incomplete';
	}
}

/** Outcome-band label. */
export function outcomeBandLabel(band: OutcomeBand): string {
	switch (band) {
		case 'routine':
			return 'Routine recall';
		case 'repeat':
			return 'Technical repeat';
		case 'assessment':
			return 'Assessment';
		case 'urgent':
			return 'Urgent';
		case 'referral':
			return 'Referral';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the outcome-band badge/banner.
 * routine → success; repeat → info; assessment → warning; urgent → error;
 * referral → warning; incomplete → base-300.
 */
export function outcomeBandColor(band: OutcomeBand): string {
	switch (band) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'repeat':
			return 'bg-info text-info-content border-info';
		case 'assessment':
			return 'bg-warning text-warning-content border-warning';
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'referral':
			return 'bg-warning text-warning-content border-warning';
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

/** Reporting-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'mammographer':
			return 'Mammographer';
		case 'advanced-practitioner':
			return 'Advanced-practitioner radiographer';
		case 'breast-radiologist':
			return 'Breast radiologist';
		case 'screening-office':
			return 'Screening office';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Episode-type label. */
export function episodeTypeLabel(type: EpisodeType): string {
	switch (type) {
		case 'routine-recall':
			return 'Routine recall';
		case 'very-first-call':
			return 'Very first call';
		case 'self-referral':
			return 'Self-referral';
		case 'higher-risk-surveillance':
			return 'Higher-risk surveillance';
		default:
			return '';
	}
}
