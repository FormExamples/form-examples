import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	HaemodynamicStatus,
	Priority,
	RecommendedPathway,
	Sex,
	ThreeLevelBand,
	TwoLevelBand,
	YesNo
} from './types';

/** Two-level (NICE NG158) band label for display. */
export function twoLevelBandLabel(band: TwoLevelBand): string {
	switch (band) {
		case 'likely':
			return 'PE likely (Wells > 4)';
		case 'unlikely':
			return 'PE unlikely (Wells <= 4)';
		default:
			return '';
	}
}

/** Three-level (original Wells) band label for display. */
export function threeLevelBandLabel(band: ThreeLevelBand): string {
	switch (band) {
		case 'low':
			return 'Low probability';
		case 'moderate':
			return 'Moderate probability';
		case 'high':
			return 'High probability';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the two-level band badge/banner.
 * PE likely → error; PE unlikely → success.
 */
export function twoLevelBandColor(band: TwoLevelBand): string {
	switch (band) {
		case 'likely':
			return 'bg-error text-error-content border-error';
		case 'unlikely':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for the three-level band badge. */
export function threeLevelBandColor(band: ThreeLevelBand): string {
	switch (band) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a criterion point pill. */
export function pointColor(point: number): string {
	if (point > 0) {
		return 'bg-warning text-warning-content border-warning';
	}
	if (point < 0) {
		return 'bg-info text-info-content border-info';
	}
	return 'bg-base-300 text-base-content border-base-300';
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

/** Recommended-pathway label. */
export function recommendedPathwayLabel(pathway: RecommendedPathway): string {
	switch (pathway) {
		case 'ctpa':
			return 'CT pulmonary angiogram (CTPA)';
		case 'd-dimer':
			return 'D-dimer';
		default:
			return '';
	}
}

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse-practitioner':
			return 'Nurse practitioner';
		case 'physician-associate':
			return 'Physician associate';
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
		case 'acute-medical-unit':
			return 'Acute medical unit';
		case 'ambulatory':
			return 'Ambulatory / same-day emergency care';
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

/** Adult age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case '18-39':
			return '18-39';
		case '40-64':
			return '40-64';
		case '65-74':
			return '65-74';
		case '75-84':
			return '75-84';
		case '85-plus':
			return '85 and over';
		default:
			return '';
	}
}

/** Haemodynamic-status label. */
export function haemodynamicStatusLabel(status: HaemodynamicStatus): string {
	switch (status) {
		case 'stable':
			return 'Stable';
		case 'unstable':
			return 'Unstable';
		default:
			return '';
	}
}

/** Yes/No label. */
export function yesNoLabel(v: YesNo): string {
	switch (v) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return 'Not recorded';
	}
}
