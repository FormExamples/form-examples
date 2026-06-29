import type {
	AppropriatenessBand,
	ContraindicationBand,
	TriageTier,
	Recommendation,
	PrimaryIndication,
	ProcedureIntent,
	CtHeadStatus,
	Setting
} from './types';

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

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

/** Axis B safety / contraindication display label. */
export function contraindicationLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not graded';
	}
}

/** Axis D triage-tier display label. */
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

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and schedule';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect to a more suitable pathway';
		case 'reject':
			return 'Reject — contraindicated';
		default:
			return 'Not graded';
	}
}

/** Human-readable primary-indication label. */
export function indicationLabel(value: PrimaryIndication | string): string {
	switch (value) {
		case 'suspected-meningitis':
			return 'Suspected meningitis';
		case 'suspected-subarachnoid-haemorrhage':
			return 'Suspected subarachnoid haemorrhage';
		case 'suspected-multiple-sclerosis':
			return 'Suspected multiple sclerosis';
		case 'suspected-guillain-barre':
			return 'Suspected Guillain-Barré';
		case 'idiopathic-intracranial-hypertension':
			return 'Idiopathic intracranial hypertension';
		case 'suspected-cns-malignancy':
			return 'Suspected CNS malignancy';
		case 'cns-infection':
			return 'CNS infection';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable procedure-intent label. */
export function procedureIntentLabel(value: ProcedureIntent | string): string {
	switch (value) {
		case 'diagnostic':
			return 'Diagnostic';
		case 'therapeutic':
			return 'Therapeutic';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable CT-head-status label. */
export function ctHeadStatusLabel(value: CtHeadStatus | string): string {
	switch (value) {
		case 'not-required':
			return 'Not required';
		case 'awaited':
			return 'Awaited';
		case 'done-normal':
			return 'Done — normal / reassuring';
		case 'done-abnormal':
			return 'Done — abnormal';
		default:
			return 'Not recorded';
	}
}

/** Human-readable care-setting label. */
export function settingLabel(value: Setting | string): string {
	switch (value) {
		case 'outpatient':
			return 'Outpatient';
		case 'inpatient':
			return 'Inpatient';
		case 'day-case':
			return 'Day case';
		case 'emergency':
			return 'Emergency department';
		case 'community':
			return 'Community';
		default:
			return 'Unspecified';
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

/** Axis B safety / contraindication badge colour. */
export function contraindicationColor(value: ContraindicationBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D triage-tier badge colour. */
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
