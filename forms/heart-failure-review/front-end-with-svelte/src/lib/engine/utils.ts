import type {
	AgeBand,
	CareSetting,
	ClinicianRole,
	FunctionalStatus,
	HeartFailureType,
	OptimisationStatus,
	PillarStatus,
	Priority,
	ReviewStatus,
	Sex
} from './types';

/** NYHA functional-status label for display. */
export function functionalStatusLabel(status: FunctionalStatus): string {
	switch (status) {
		case 'stable':
			return 'Stable (NYHA I–II)';
		case 'symptomatic':
			return 'Symptomatic (NYHA III)';
		case 'advanced':
			return 'Advanced (NYHA IV)';
		case 'unknown':
			return 'Not assessed';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the functional-status badge/banner.
 * stable → success; symptomatic → warning; advanced → error; unknown → base.
 */
export function functionalStatusColor(status: FunctionalStatus): string {
	switch (status) {
		case 'stable':
			return 'bg-success text-success-content border-success';
		case 'symptomatic':
			return 'bg-warning text-warning-content border-warning';
		case 'advanced':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Medication-optimisation-status label for display. */
export function optimisationStatusLabel(status: OptimisationStatus): string {
	switch (status) {
		case 'optimised':
			return 'Optimised';
		case 'partial':
			return 'Partially optimised';
		case 'suboptimal':
			return 'Suboptimal';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for the optimisation-status badge/banner. */
export function optimisationStatusColor(status: OptimisationStatus): string {
	switch (status) {
		case 'optimised':
			return 'bg-success text-success-content border-success';
		case 'partial':
			return 'bg-warning text-warning-content border-warning';
		case 'suboptimal':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Review-completeness-status label for display. */
export function reviewStatusLabel(status: ReviewStatus): string {
	switch (status) {
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

/** Lily-token colour utility classes for the review-status badge/banner. */
export function reviewStatusColor(status: ReviewStatus): string {
	switch (status) {
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

/** Lily-token colour utility classes for a per-domain documented pill. */
export function documentedColor(documented: boolean): string {
	return documented
		? 'bg-success text-success-content border-success'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Heart-failure-type label for display. */
export function heartFailureTypeLabel(type: HeartFailureType): string {
	switch (type) {
		case 'reduced':
			return 'Reduced EF (HFrEF)';
		case 'mildly-reduced':
			return 'Mildly-reduced EF (HFmrEF)';
		case 'preserved':
			return 'Preserved EF (HFpEF)';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Reviewing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'gp':
			return 'General practitioner';
		case 'practice-nurse':
			return 'Practice nurse';
		case 'hf-nurse':
			return 'Heart-failure specialist nurse';
		case 'pharmacist':
			return 'Clinical pharmacist';
		case 'cardiologist':
			return 'Cardiologist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'general-practice':
			return 'General practice';
		case 'community-hf-service':
			return 'Community heart-failure service';
		case 'hospital-clinic':
			return 'Hospital clinic';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Pillar prescribing-status label. */
export function pillarStatusLabel(status: PillarStatus): string {
	switch (status) {
		case 'prescribed':
			return 'Prescribed';
		case 'not-prescribed':
			return 'Not prescribed';
		case 'contraindicated':
			return 'Contraindicated';
		case 'not-tolerated':
			return 'Not tolerated';
		default:
			return 'Not recorded';
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
			return '18–39';
		case '40-59':
			return '40–59';
		case '60-79':
			return '60–79';
		case '>=80':
			return '80 and over';
		default:
			return '';
	}
}
