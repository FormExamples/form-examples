// Display helpers shared by the wizard, the report, and the dashboard.
//
// Colour utilities return Lily design-token classes rather than raw colours, so
// they follow the active theme.

import type { AcuityBand, CompletenessStatus, NoteType, Priority } from './types';

/** Note-type label. */
export function noteTypeLabel(t: NoteType | string): string {
	switch (t) {
		case 'admission-clerking':
			return 'Admission clerking';
		case 'progress':
			return 'Progress note';
		case 'consult':
			return 'Consult note';
		case 'event':
			return 'Event / deterioration note';
		case 'procedure':
			return 'Bedside procedure note';
		case 'handover':
			return 'Handover note';
		case 'transfer':
			return 'Transfer note';
		case 'discharge-planning':
			return 'Discharge-planning note';
		default:
			return '';
	}
}

/** Short note-type label, for dense table cells. */
export function noteTypeShortLabel(t: NoteType | string): string {
	switch (t) {
		case 'admission-clerking':
			return 'Clerking';
		case 'progress':
			return 'Progress';
		case 'consult':
			return 'Consult';
		case 'event':
			return 'Event';
		case 'procedure':
			return 'Procedure';
		case 'handover':
			return 'Handover';
		case 'transfer':
			return 'Transfer';
		case 'discharge-planning':
			return 'Discharge';
		default:
			return '';
	}
}

/** Completeness-status label for display. */
export function statusLabel(status: CompletenessStatus | ''): string {
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
 * Lily-token colour utility classes for the completeness badge/banner.
 * complete → success (entry stands alone); partial → warning (documentation
 * gaps); incomplete → error (a required component is absent).
 */
export function statusColor(status: CompletenessStatus | ''): string {
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

/** Acuity-band label for display. */
export function acuityLabel(band: AcuityBand | ''): string {
	switch (band) {
		case 'stable':
			return 'Stable';
		case 'watch':
			return 'Watch';
		case 'escalate':
			return 'Escalate';
		case 'critical':
			return 'Critical';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the acuity badge/banner. Escalate and
 * Critical are deliberately distinct: Escalate is a warning-weight state that
 * needs urgent review, Critical is an error-weight state where organ support or
 * an arrest call is already in play.
 */
export function acuityColor(band: AcuityBand | ''): string {
	switch (band) {
		case 'stable':
			return 'bg-success text-success-content border-success';
		case 'watch':
			return 'bg-warning text-warning-content border-warning';
		case 'escalate':
			return 'bg-error text-error-content border-error';
		case 'critical':
			return 'bg-error text-error-content border-error font-bold';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority | ''): string {
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

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority | ''): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-info text-info-content border-info';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** ACVPU label. */
export function acvpuLabel(v: string): string {
	switch (v) {
		case 'alert':
			return 'Alert';
		case 'confusion':
			return 'New confusion';
		case 'voice':
			return 'Responds to voice';
		case 'pain':
			return 'Responds to pain';
		case 'unresponsive':
			return 'Unresponsive';
		default:
			return '';
	}
}

/** VTE-status label. */
export function vteStatusLabel(status: string): string {
	switch (status) {
		case 'done':
			return 'Assessed';
		case 'not-done':
			return 'Not done';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return '';
	}
}

/** Escalation-status label. */
export function escalationStatusLabel(status: string): string {
	switch (status) {
		case 'for-full-escalation':
			return 'For full escalation';
		case 'for-ward-based-care':
			return 'For ward-based care';
		case 'for-hdu':
			return 'For HDU';
		case 'for-icu':
			return 'For ICU';
		case 'palliative':
			return 'Palliative';
		case 'under-review':
			return 'Under review';
		default:
			return '';
	}
}

/** Format a percentage for display. */
export function percentLabel(pct: number | null | undefined): string {
	return pct === null || pct === undefined ? 'N/A' : `${pct}%`;
}
