import type {
	AgeBand,
	CapillaryRefill,
	CareSetting,
	ClinicianRole,
	Consciousness,
	EscalationBand,
	Priority,
	RespiratoryEffort,
	Sex,
	Subscores,
	SupplementalOxygen,
	YesNo
} from './types';

/** Escalation-band label for display. */
export function escalationBandLabel(band: EscalationBand): string {
	switch (band) {
		case 'routine':
			return 'Routine (low)';
		case 'low':
			return 'Low escalation';
		case 'medium':
			return 'Medium escalation';
		case 'high':
			return 'High escalation';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the escalation-band badge/banner.
 * routine → success; low → warning; medium → warning; high → error.
 */
export function escalationBandColor(band: EscalationBand): string {
	switch (band) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'low':
			return 'bg-warning text-warning-content border-warning';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a parameter subscore pill (0-3). */
export function subscoreColor(points: number | null): string {
	if (points === null) return 'bg-base-300 text-base-content border-base-300';
	if (points >= 3) return 'bg-error text-error-content border-error';
	if (points === 2) return 'bg-warning text-warning-content border-warning';
	if (points === 1) return 'bg-warning text-warning-content border-warning';
	return 'bg-success text-success-content border-success';
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
		case 'nurse':
			return 'Nurse';
		case 'healthcare-assistant':
			return 'Healthcare assistant';
		case 'doctor':
			return 'Doctor';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'ward':
			return 'Paediatric ward';
		case 'childrens-assessment-unit':
			return "Children's assessment unit";
		case 'emergency-department':
			return 'Emergency department';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Age-band label for display, including the mapped age range. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case 'neonate':
			return 'Neonate (0 to <1 month)';
		case 'infant':
			return 'Infant (1-11 months)';
		case 'young-child':
			return 'Young child (1-4 years)';
		case 'child':
			return 'Child (5-11 years)';
		case 'adolescent':
			return 'Adolescent (>= 12 years)';
		default:
			return '';
	}
}

/** Patient sex label. */
export function sexLabel(value: Sex): string {
	switch (value) {
		case 'male':
			return 'Male';
		case 'female':
			return 'Female';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Respiratory-effort label. */
export function respiratoryEffortLabel(value: RespiratoryEffort): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'mild':
			return 'Mild recession';
		case 'moderate':
			return 'Moderate recession';
		case 'severe':
			return 'Severe recession / grunting';
		default:
			return '';
	}
}

/** Supplemental-oxygen label. */
export function supplementalOxygenLabel(value: SupplementalOxygen): string {
	switch (value) {
		case 'room-air':
			return 'Room air';
		case 'low-flow':
			return 'Low-flow oxygen';
		case 'high-flow':
			return 'High-flow / FiO2 >= 0.5';
		default:
			return '';
	}
}

/** Capillary-refill label. */
export function capillaryRefillLabel(value: CapillaryRefill): string {
	switch (value) {
		case 'under-2s':
			return '< 2 s, pink';
		case '2-3s':
			return '2-3 s';
		case '3-4s':
			return '3-4 s, pale';
		case 'over-4s':
			return '> 4 s, mottled / cyanosed';
		default:
			return '';
	}
}

/** Consciousness (ACVPU) label. */
export function consciousnessLabel(value: Consciousness): string {
	switch (value) {
		case 'alert':
			return 'Alert / playing';
		case 'voice':
			return 'Responds to Voice / irritable';
		case 'pain':
			return 'Responds to Pain';
		case 'unresponsive':
			return 'Unresponsive';
		default:
			return '';
	}
}

/** Yes/No label. */
export function yesNoLabel(value: YesNo): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return '';
	}
}

/** Human-readable label for a single parameter subscore key. */
export function subscoreLabel(key: keyof Subscores): string {
	switch (key) {
		case 'respiratoryRate':
			return 'Respiratory rate';
		case 'respiratoryEffort':
			return 'Respiratory effort';
		case 'oxygenSaturation':
			return 'Oxygen saturation (SpO2)';
		case 'supplementalOxygen':
			return 'Supplemental oxygen';
		case 'heartRate':
			return 'Heart rate';
		case 'capillaryRefill':
			return 'Capillary refill';
		case 'consciousness':
			return 'Consciousness (ACVPU)';
		default:
			return '';
	}
}
