import type {
	AgeBand,
	AnaestheticTechnique,
	AsaStatus,
	NurseRole,
	Priority,
	ReadinessBand,
	Sex
} from './types';

/** Readiness-band label for display. */
export function readinessBandLabel(band: ReadinessBand): string {
	switch (band) {
		case 'discharge-ready':
			return 'Discharge-ready (Aldrete >= 9, SpO2 met)';
		case 'not-ready':
			return 'Not ready';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the readiness-band badge/banner.
 * Discharge-ready → success; not ready → error.
 */
export function readinessBandColor(band: ReadinessBand): string {
	switch (band) {
		case 'discharge-ready':
			return 'bg-success text-success-content border-success';
		case 'not-ready':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a parameter sub-score pill (0/1/2). */
export function scoreColor(score: 0 | 1 | 2): string {
	switch (score) {
		case 2:
			return 'bg-success text-success-content border-success';
		case 1:
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-error text-error-content border-error';
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

/** Recording-staff role label. */
export function nurseRoleLabel(role: NurseRole): string {
	switch (role) {
		case 'recovery-nurse':
			return 'Recovery nurse';
		case 'odp':
			return 'Operating-department practitioner';
		case 'anaesthetist':
			return 'Anaesthetist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Anaesthetic-technique label. */
export function anaestheticTechniqueLabel(technique: AnaestheticTechnique): string {
	switch (technique) {
		case 'general':
			return 'General anaesthesia';
		case 'regional':
			return 'Regional anaesthesia';
		case 'sedation':
			return 'Procedural sedation';
		case 'combined':
			return 'Combined';
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

/** Adult age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case '16-39':
			return '16-39';
		case '40-59':
			return '40-59';
		case '60-74':
			return '60-74';
		case '75-plus':
			return '75 and over';
		default:
			return '';
	}
}

/** ASA physical-status label. */
export function asaStatusLabel(status: AsaStatus): string {
	return status ? `ASA ${status}` : '';
}
