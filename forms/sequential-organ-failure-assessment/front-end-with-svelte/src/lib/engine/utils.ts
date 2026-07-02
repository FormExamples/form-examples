import type {
	AssessorRole,
	CareLocation,
	MortalityBand,
	OrganSystem,
	Priority,
	RespiratorySupport,
	Sex,
	SubScore,
	SuspectedInfection,
	Vasopressor
} from './types';

/** Mortality-band label for display. */
export function mortalityBandLabel(band: MortalityBand): string {
	switch (band) {
		case 'low':
			return 'Low (< 10%)';
		case 'moderate':
			return 'Moderate (~15-20%)';
		case 'high':
			return 'High (~40-50%)';
		case 'veryHigh':
			return 'Very high (~50-60%)';
		case 'extreme':
			return 'Extreme (> 80%)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the mortality-band badge/banner.
 * low → success; moderate → warning; high/veryHigh/extreme → error.
 */
export function mortalityBandColor(band: MortalityBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
		case 'veryHigh':
		case 'extreme':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a per-system sub-score pill (0-4 or null). */
export function subScoreColor(score: SubScore): string {
	if (score === null) return 'bg-base-300 text-base-content border-base-300';
	if (score >= 3) return 'bg-error text-error-content border-error';
	if (score === 2) return 'bg-warning text-warning-content border-warning';
	if (score === 1) return 'bg-info text-info-content border-info';
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

/** Organ-system label for display. */
export function systemLabel(system: OrganSystem | string): string {
	switch (system) {
		case 'respiration':
			return 'Respiration';
		case 'coagulation':
			return 'Coagulation';
		case 'liver':
			return 'Liver';
		case 'cardiovascular':
			return 'Cardiovascular';
		case 'cns':
			return 'Central nervous system';
		case 'renal':
			return 'Renal';
		default:
			return String(system);
	}
}

/** Assessing-clinician role label. */
export function roleLabel(role: AssessorRole): string {
	switch (role) {
		case 'intensivist':
			return 'Intensivist';
		case 'critical-care-physician':
			return 'Critical-care physician';
		case 'acute-physician':
			return 'Acute-medicine physician';
		case 'resident':
			return 'Resident';
		case 'nurse':
			return 'Critical-care nurse';
		case 'outreach-practitioner':
			return 'Outreach practitioner';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-location label. */
export function careLocationLabel(location: CareLocation): string {
	switch (location) {
		case 'icu':
			return 'Intensive care unit';
		case 'hdu':
			return 'High-dependency unit';
		case 'critical-care-outreach':
			return 'Critical-care outreach';
		case 'acute-medical-unit':
			return 'Acute medical unit';
		case 'emergency-department':
			return 'Emergency department';
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

/** Suspected-infection label. */
export function suspectedInfectionLabel(v: SuspectedInfection): string {
	switch (v) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Respiratory-support label. */
export function respiratorySupportLabel(v: RespiratorySupport): string {
	switch (v) {
		case 'ventilated':
			return 'Mechanical ventilation';
		case 'cpap':
			return 'CPAP';
		case 'none':
			return 'None';
		default:
			return '';
	}
}

/** Vasopressor / inotrope agent label. */
export function vasopressorLabel(v: Vasopressor): string {
	switch (v) {
		case 'none':
			return 'None';
		case 'dopamine':
			return 'Dopamine';
		case 'dobutamine':
			return 'Dobutamine';
		case 'adrenaline':
			return 'Adrenaline (epinephrine)';
		case 'noradrenaline':
			return 'Noradrenaline (norepinephrine)';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}
