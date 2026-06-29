import type {
	AppropriatenessBand,
	TriageTier,
	PriorityBand,
	Recommendation,
	TestType,
	PrimaryIndication
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable label for a requested test type. */
export function testTypeLabel(value: TestType | string): string {
	switch (value) {
		case 'pure-tone-audiometry':
			return 'Pure-tone audiometry';
		case 'tympanometry':
			return 'Tympanometry';
		case 'speech-audiometry':
			return 'Speech audiometry';
		case 'otoacoustic-emissions':
			return 'Otoacoustic emissions';
		case 'auditory-brainstem-response':
			return 'Auditory brainstem response';
		case 'newborn-hearing-screen':
			return 'Newborn hearing screen';
		case 'hearing-aid-assessment':
			return 'Hearing-aid assessment';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable label for a primary indication. */
export function indicationLabel(value: PrimaryIndication | string): string {
	switch (value) {
		case 'hearing-loss':
			return 'Hearing loss';
		case 'tinnitus':
			return 'Tinnitus';
		case 'vertigo':
			return 'Vertigo';
		case 'ear-discharge':
			return 'Ear discharge';
		case 'suspected-otosclerosis':
			return 'Suspected otosclerosis';
		case 'occupational-noise':
			return 'Occupational noise exposure';
		case 'ototoxic-monitoring':
			return 'Ototoxic monitoring';
		case 'developmental-delay-child':
			return 'Developmental delay (child)';
		case 'hearing-aid-review':
			return 'Hearing-aid review';
		case 'sudden-hearing-loss':
			return 'Sudden hearing loss';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B triage-tier display label. */
export function triageTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Axis D clinical-priority display label. */
export function priorityLabel(value: string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect to a more suitable test';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D clinical-priority badge colour. */
export function priorityBandColor(value: PriorityBand | string): string {
	switch (value) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-info text-info-content border-info';
		case 'redirect':
			return 'bg-warning text-warning-content border-warning';
		case 'reject':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
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
