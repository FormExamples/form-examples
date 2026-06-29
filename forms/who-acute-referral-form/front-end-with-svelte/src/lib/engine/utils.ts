import type { AssessmentData, FlagPriority, ModeOfTransfer, SectionKey } from './types';

/** Calculate age from a date-of-birth string. Returns null on invalid input. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

/** True if a string is non-empty after trimming. */
export function hasText(s: string | null | undefined): boolean {
	return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No/Unknown field has any answer. */
export function isYesNoUnknownAnswered(value: string): boolean {
	return value === 'yes' || value === 'no' || value === 'unknown';
}

/** True if a value is a finite number (not null and not NaN). */
export function hasNumber(v: number | null | undefined): boolean {
	return typeof v === 'number' && Number.isFinite(v);
}

/** Convenience predicate: true if any precaution flag has been ticked. */
export function anyPrecautionFlagged(data: AssessmentData): boolean {
	const p = data.recommendations.precautions;
	return (
		p.highlyInfectiousDisease ||
		p.spinalPrecautions ||
		p.weightBearingRestrictions ||
		p.fallRisk ||
		p.aspirationRisk ||
		p.other
	);
}

/** Human-readable label for a section key. */
export function sectionLabel(section: SectionKey): string {
	switch (section) {
		case 'patientIdentification':
			return 'Patient Identification';
		case 'facilityAndTransport':
			return 'Facility & Transport';
		case 'situation':
			return 'Situation';
		case 'background':
			return 'Background';
		case 'assessment':
			return 'Assessment';
		case 'recommendations':
			return 'Recommendations';
		case 'initiatingProviderSignoff':
			return 'Provider Sign-off';
		case 'referralFacilityReceipt':
			return 'Referral Facility Receipt';
	}
}

/** Lily-token colour classes for a flag priority badge. */
export function priorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-warning text-warning-content border-warning';
	}
}

/** Human-readable label for a flag priority. */
export function priorityLabel(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'Urgent';
		case 'high':
			return 'High';
		case 'medium':
			return 'Medium';
		case 'low':
			return 'Low';
	}
}

/** Human-readable label for a mode of transfer. */
export function modeOfTransferLabel(mode: ModeOfTransfer): string {
	switch (mode) {
		case 'ground':
			return 'Ground (ambulance)';
		case 'air':
			return 'Air';
		case 'sea':
			return 'Sea';
		default:
			return '—';
	}
}
