import type {
	AppropriatenessBand,
	TriageTier,
	RiskBand,
	Recommendation,
	Procedure,
	Indication,
	Urgency,
	Setting,
	ClinicianRole
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable label for a requested procedure. */
export function procedureLabel(value: Procedure | string): string {
	switch (value) {
		case 'flexible-cystoscopy':
			return 'Flexible cystoscopy';
		case 'rigid-cystoscopy':
			return 'Rigid cystoscopy';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable label for a primary indication. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'visible-haematuria':
			return 'Visible haematuria';
		case 'non-visible-haematuria':
			return 'Non-visible haematuria';
		case 'recurrent-uti':
			return 'Recurrent UTI';
		case 'lower-urinary-tract-symptoms':
			return 'Lower urinary tract symptoms';
		case 'bladder-cancer-surveillance':
			return 'Bladder cancer surveillance';
		case 'suspected-bladder-tumour':
			return 'Suspected bladder tumour';
		case 'urethral-stricture':
			return 'Urethral stricture';
		case 'catheter-problems':
			return 'Catheter problems';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable clinician-role label. */
export function clinicianRoleLabel(value: ClinicianRole | string): string {
	switch (value) {
		case 'urologist':
			return 'Urologist';
		case 'gp':
			return 'GP';
		case 'hospital-doctor':
			return 'Hospital doctor';
		case 'nurse-cystoscopist':
			return 'Nurse cystoscopist';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Care-setting label. */
export function settingLabel(value: Setting | string): string {
	switch (value) {
		case 'outpatient':
			return 'Outpatient';
		case 'inpatient':
			return 'Inpatient';
		case 'community':
			return 'Community';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Unspecified';
	}
}

/** Requested-urgency label. */
export function urgencyLabel(value: Urgency | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week wait';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: AppropriatenessBand | string): string {
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
export function triageTierLabel(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week wait';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Axis D pre-procedure-risk display label. */
export function riskBandLabel(value: RiskBand | string): string {
	switch (value) {
		case 'low':
			return 'Low risk';
		case 'moderate':
			return 'Moderate risk';
		case 'high':
			return 'High risk';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect';
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
		case 'two-week-wait':
			return 'bg-info text-info-content border-info';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D pre-procedure-risk badge colour. */
export function riskBandColor(value: RiskBand | string): string {
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
			return 'bg-warning text-warning-content border-warning';
		case 'redirect':
			return 'bg-info text-info-content border-info';
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
