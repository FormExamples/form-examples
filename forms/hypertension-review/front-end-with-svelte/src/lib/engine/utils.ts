import type {
	AgeBand,
	ClinicianRole,
	ControlClass,
	Ethnicity,
	HypertensionStage,
	MonitoringMethod,
	PrimarySource,
	Priority,
	ReviewStatus,
	Sex
} from './types';

/** A numeric field is present when it is neither null/undefined nor NaN. */
export function present(v: number | null | undefined): v is number {
	return v !== null && v !== undefined && !Number.isNaN(v);
}

/** Control-status label for display. */
export function controlStatusLabel(controlClass: ControlClass): string {
	switch (controlClass) {
		case 'controlled':
			return 'Controlled';
		case 'uncontrolled':
			return 'Uncontrolled';
		case 'severe-uncontrolled':
			return 'Severe uncontrolled';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the control-status badge/banner.
 * controlled → success; uncontrolled → warning; severe-uncontrolled → error.
 */
export function controlStatusColor(controlClass: ControlClass): string {
	switch (controlClass) {
		case 'controlled':
			return 'bg-success text-success-content border-success';
		case 'uncontrolled':
			return 'bg-warning text-warning-content border-warning';
		case 'severe-uncontrolled':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Review-completeness label for display. */
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

/**
 * Lily-token colour utility classes for the review-status badge/banner.
 * complete → success; partial → warning; incomplete → error.
 */
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

/** Hypertension-stage label for display. */
export function hypertensionStageLabel(stage: HypertensionStage): string {
	switch (stage) {
		case 'none':
			return 'No stage';
		case 'stage-1':
			return 'Stage 1';
		case 'stage-2':
			return 'Stage 2';
		case 'stage-3-severe':
			return 'Stage 3 (severe)';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for the hypertension-stage badge. */
export function hypertensionStageColor(stage: HypertensionStage): string {
	switch (stage) {
		case 'none':
			return 'bg-success text-success-content border-success';
		case 'stage-1':
			return 'bg-info text-info-content border-info';
		case 'stage-2':
			return 'bg-warning text-warning-content border-warning';
		case 'stage-3-severe':
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

/** Lily-token colour utility classes for a per-component documented pill. */
export function documentedColor(documented: boolean): string {
	return documented
		? 'bg-success text-success-content border-success'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Primary-source label. */
export function primarySourceLabel(source: PrimarySource): string {
	switch (source) {
		case 'home':
			return 'Home / ambulatory';
		case 'clinic':
			return 'Clinic';
		case 'none':
			return 'No reading';
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
		case 'pharmacist':
			return 'Clinical pharmacist';
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
		case '18-39':
			return '18-39';
		case '40-59':
			return '40-59';
		case '60-79':
			return '60-79';
		case '>=80':
			return '80 and over';
		default:
			return '';
	}
}

/** Ethnicity label. */
export function ethnicityLabel(ethnicity: Ethnicity): string {
	switch (ethnicity) {
		case 'white':
			return 'White';
		case 'black-african-caribbean':
			return 'Black African / Caribbean';
		case 'south-asian':
			return 'South Asian';
		case 'mixed':
			return 'Mixed';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Monitoring-method label. */
export function monitoringMethodLabel(method: MonitoringMethod): string {
	switch (method) {
		case 'clinic-only':
			return 'Clinic only';
		case 'hbpm':
			return 'Home (HBPM)';
		case 'abpm':
			return 'Ambulatory (ABPM)';
		default:
			return '';
	}
}
