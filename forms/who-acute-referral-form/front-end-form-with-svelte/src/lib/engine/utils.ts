import type { AssessmentData, FlagPriority, SectionKey } from './types';

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

/** Tailwind colour classes for a flag priority badge. */
export function priorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-red-200 text-red-900 border-red-400';
		case 'high':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'medium':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'low':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
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
