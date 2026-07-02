import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	InjuryTimeKnown,
	Mechanism,
	PlanStatus,
	Priority,
	Sex,
	TbsaMethod,
	YesNo
} from './types';

/** Plan-status label for display. */
export function statusLabel(status: PlanStatus): string {
	switch (status) {
		case 'planned':
			return 'Resuscitation planned';
		case 'overdue':
			return 'Resuscitation overdue';
		case 'incomplete':
			return 'Awaiting inputs';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the status badge/banner.
 * planned → success; overdue → error; incomplete → base.
 */
export function statusColor(status: PlanStatus): string {
	switch (status) {
		case 'planned':
			return 'bg-success text-success-content border-success';
		case 'overdue':
			return 'bg-error text-error-content border-error';
		case 'incomplete':
			return 'bg-base-300 text-base-content border-base-300';
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

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'paramedic':
			return 'Paramedic';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'emergency-department':
			return 'Emergency department';
		case 'burns-unit':
			return 'Burns unit';
		case 'intensive-care':
			return 'Intensive care';
		case 'retrieval':
			return 'Retrieval / transfer';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Patient-sex label. */
export function sexLabel(sex: Sex): string {
	switch (sex) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'intersex':
			return 'Intersex';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case 'adult':
			return 'Adult';
		case 'child':
			return 'Child';
		default:
			return '';
	}
}

/** %TBSA estimation-method label. */
export function tbsaMethodLabel(method: TbsaMethod): string {
	switch (method) {
		case 'rule-of-nines':
			return 'Wallace Rule of Nines';
		case 'lund-browder':
			return 'Lund-Browder chart';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Burn-mechanism label. */
export function mechanismLabel(mechanism: Mechanism): string {
	switch (mechanism) {
		case 'thermal':
			return 'Thermal';
		case 'electrical':
			return 'Electrical';
		case 'chemical':
			return 'Chemical';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Injury-time-known label. */
export function injuryTimeKnownLabel(v: InjuryTimeKnown): string {
	switch (v) {
		case 'known':
			return 'Known';
		case 'estimated':
			return 'Estimated';
		default:
			return '';
	}
}

/** Yes/no label. */
export function yesNoLabel(v: YesNo): string {
	switch (v) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return '';
	}
}

/** Format a millilitre volume for display, or a dash when null. */
export function formatVolume(n: number | null): string {
	return n === null || n === undefined ? '—' : `${Math.round(n)} mL`;
}

/** Format a millilitre-per-hour rate for display, or a dash when null. */
export function formatRate(n: number | null): string {
	return n === null || n === undefined ? '—' : `${Math.round(n)} mL/h`;
}

/** Format an hours value for display, or a dash when null. */
export function formatHours(n: number | null): string {
	if (n === null || n === undefined) return '—';
	return `${Math.round(n * 10) / 10} h`;
}
