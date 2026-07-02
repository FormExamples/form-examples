import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	ContractionDurationBand,
	ContractionStrength,
	Dipstick,
	LiquorState,
	Membranes,
	Moulding,
	Parity,
	Priority,
	ProgressClassification
} from './types';

/** Progress-classification label for display. */
export function progressLabel(classification: ProgressClassification): string {
	switch (classification) {
		case 'normal':
			return 'Normal';
		case 'alertLineCrossed':
			return 'Alert line crossed';
		case 'actionLineCrossed':
			return 'Action line crossed';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the progress badge/banner.
 * Normal → success; Alert-line crossed → warning; Action-line crossed → error.
 */
export function progressColor(classification: ProgressClassification): string {
	switch (classification) {
		case 'normal':
			return 'bg-success text-success-content border-success';
		case 'alertLineCrossed':
			return 'bg-warning text-warning-content border-warning';
		case 'actionLineCrossed':
			return 'bg-error text-error-content border-error';
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

/** Recording-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'midwife':
			return 'Midwife';
		case 'obstetrician':
			return 'Obstetrician';
		case 'nurse':
			return 'Nurse';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'labour-ward':
			return 'Labour ward';
		case 'birth-centre':
			return 'Birth centre';
		case 'triage':
			return 'Triage';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case 'under-18':
			return 'Under 18';
		case '18-24':
			return '18-24';
		case '25-34':
			return '25-34';
		case '35-39':
			return '35-39';
		case '40-plus':
			return '40+';
		default:
			return '';
	}
}

/** Parity label. */
export function parityLabel(parity: Parity): string {
	switch (parity) {
		case 'nulliparous':
			return 'Nulliparous';
		case 'multiparous':
			return 'Multiparous';
		default:
			return '';
	}
}

/** Membranes-on-admission label. */
export function membranesLabel(m: Membranes): string {
	switch (m) {
		case 'intact':
			return 'Intact';
		case 'ruptured':
			return 'Ruptured';
		default:
			return '';
	}
}

/** Contraction-duration band label. */
export function durationBandLabel(band: ContractionDurationBand): string {
	switch (band) {
		case '<20s':
			return '< 20 s';
		case '20-40s':
			return '20-40 s';
		case '>40s':
			return '> 40 s';
		default:
			return '';
	}
}

/** Contraction-strength label. */
export function contractionStrengthLabel(s: ContractionStrength): string {
	switch (s) {
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'strong':
			return 'Strong';
		default:
			return '';
	}
}

/** Liquor-state label. */
export function liquorStateLabel(s: LiquorState): string {
	switch (s) {
		case 'intact':
			return 'Membranes intact';
		case 'clear':
			return 'Clear';
		case 'meconium':
			return 'Meconium-stained';
		case 'blood-stained':
			return 'Blood-stained';
		case 'absent':
			return 'Absent';
		default:
			return '';
	}
}

/** Moulding label. */
export function mouldingLabel(m: Moulding): string {
	switch (m) {
		case '0':
			return '0 (none)';
		case '+':
			return '+';
		case '++':
			return '++';
		case '+++':
			return '+++';
		default:
			return '';
	}
}

/** Urine-dipstick label. */
export function dipstickLabel(d: Dipstick): string {
	switch (d) {
		case 'negative':
			return 'Negative';
		case 'trace':
			return 'Trace';
		case '+':
			return '+';
		case '++':
			return '++';
		case '+++':
			return '+++';
		default:
			return '';
	}
}
