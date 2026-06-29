import type {
	CompletenessLevel,
	DischargeDestination,
	CareResponsibility,
	TransportMode,
	AdditionalFlag,
	AssessmentData
} from './types';

/** Compute length of stay (days) from admission and discharge dates. Returns null if invalid. */
export function calculateLengthOfStay(
	admissionDate: string,
	dischargeDate: string
): number | null {
	if (!admissionDate || !dischargeDate) return null;
	const a = new Date(admissionDate);
	const d = new Date(dischargeDate);
	if (isNaN(a.getTime()) || isNaN(d.getTime())) return null;
	const ms = d.getTime() - a.getTime();
	if (ms < 0) return null;
	return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** Calculate age from date of birth string. */
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

/** Friendly label for a CompletenessLevel. */
export function completenessLabel(level: CompletenessLevel): string {
	switch (level) {
		case 'complete':
			return 'Complete — safe to proceed';
		case 'partial':
			return 'Partial — may proceed with flag';
		case 'incomplete':
			return 'Incomplete — do not proceed';
		default:
			return '';
	}
}

/** Short label for a CompletenessLevel (used by the dashboard and badges). */
export function completenessShortLabel(level: CompletenessLevel): string {
	switch (level) {
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

/** Lily-token colour triple for the completeness badge. */
export function completenessColor(level: CompletenessLevel): string {
	switch (level) {
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

/** Lily-token colour triple for a flag priority. */
export function priorityColor(priority: AdditionalFlag['priority']): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
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

/** Human-readable label for a discharge destination. */
export function destinationLabel(destination: DischargeDestination): string {
	switch (destination) {
		case 'home':
			return 'Own home';
		case 'care-home':
			return 'Care home';
		case 'nursing-home':
			return 'Nursing home';
		case 'rehab':
			return 'Rehabilitation unit';
		case 'hospice':
			return 'Hospice';
		case 'other-hospital':
			return 'Other hospital';
		case 'other':
			return 'Other';
		default:
			return '—';
	}
}

/** Human-readable label for the post-discharge care responsibility. */
export function careResponsibilityLabel(responsibility: CareResponsibility): string {
	switch (responsibility) {
		case 'self':
			return 'Self-caring';
		case 'family':
			return 'Family';
		case 'carer':
			return 'Informal carer';
		case 'community-team':
			return 'Community team';
		case 'care-home-staff':
			return 'Care-home staff';
		case 'other':
			return 'Other';
		default:
			return '—';
	}
}

/** Human-readable label for the transport mode. */
export function transportModeLabel(mode: TransportMode): string {
	switch (mode) {
		case 'walking':
			return 'Walking / own transport';
		case 'wheelchair':
			return 'Wheelchair';
		case 'stretcher':
			return 'Stretcher';
		case 'ambulance':
			return 'Ambulance';
		case 'unknown':
			return 'Unknown';
		default:
			return '—';
	}
}

/** Summarise the follow-up arrangement for a discharge record. */
export function followUpLabel(data: AssessmentData): string {
	const f = data.followupArrangements;
	if (f.outpatientFollowupRequired === 'yes' || f.appointments.some((a) => a.provider)) {
		return 'Outpatient clinic';
	}
	if (f.gpFollowupRequired === 'yes') return 'GP';
	if (data.communityCareInstructions.districtNurseReferral === 'yes') return 'Community nurse';
	return 'None';
}
