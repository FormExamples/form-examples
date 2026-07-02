import type {
	Acvpu,
	AirOrOxygen,
	ClinicianRole,
	OxygenDevice,
	Priority,
	RiskBand,
	Spo2Scale,
	Subscores,
	YesNo
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low risk';
		case 'low-medium':
			return 'Low-medium risk';
		case 'medium':
			return 'Medium risk';
		case 'high':
			return 'High risk';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * low → success; low-medium → warning; medium → warning; high → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'low-medium':
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

/** Recording-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'healthcare-assistant':
			return 'Healthcare assistant';
		case 'paramedic':
			return 'Paramedic';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** SpO2 scale label. */
export function spo2ScaleLabel(scale: Spo2Scale): string {
	switch (scale) {
		case 'scale-1':
			return 'Scale 1 (default target)';
		case 'scale-2':
			return 'Scale 2 (target 88-92%)';
		default:
			return '';
	}
}

/** ACVPU consciousness label. */
export function acvpuLabel(value: Acvpu): string {
	switch (value) {
		case 'A':
			return 'Alert';
		case 'C':
			return 'New confusion';
		case 'V':
			return 'Voice';
		case 'P':
			return 'Pain';
		case 'U':
			return 'Unresponsive';
		default:
			return '';
	}
}

/** Air-or-oxygen label. */
export function airOrOxygenLabel(value: AirOrOxygen): string {
	switch (value) {
		case 'air':
			return 'Air';
		case 'oxygen':
			return 'Supplemental oxygen';
		default:
			return '';
	}
}

/** Supplemental-oxygen device label. */
export function oxygenDeviceLabel(device: OxygenDevice): string {
	switch (device) {
		case 'nasal-cannula':
			return 'Nasal cannula';
		case 'simple-face-mask':
			return 'Simple face mask';
		case 'venturi-mask':
			return 'Venturi mask';
		case 'non-rebreather-mask':
			return 'Non-rebreather mask';
		case 'humidified':
			return 'Humidified oxygen';
		case 'cpap':
			return 'CPAP';
		case 'niv':
			return 'Non-invasive ventilation';
		case 'tracheostomy':
			return 'Tracheostomy';
		case 'ventilator':
			return 'Ventilator';
		case 'other':
			return 'Other';
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
			return 'Respiration rate';
		case 'spo2':
			return 'Oxygen saturation (SpO2)';
		case 'oxygen':
			return 'Air or oxygen';
		case 'systolicBp':
			return 'Systolic blood pressure';
		case 'pulse':
			return 'Pulse';
		case 'consciousness':
			return 'Consciousness (ACVPU)';
		case 'temperature':
			return 'Temperature';
		default:
			return '';
	}
}
