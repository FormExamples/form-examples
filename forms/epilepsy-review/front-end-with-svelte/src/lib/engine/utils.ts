import type {
	Adherence,
	AgeBand,
	CareSetting,
	DvlaEligible,
	EpilepsyType,
	MentalHealthConcern,
	PppStatus,
	Priority,
	ReviewStatus,
	ReviewerRole,
	SeizureControl,
	SeizureFrequency,
	SeizureTrend,
	Sex,
	SideEffects
} from './types';

/** A numeric field is present when it is neither null/undefined nor NaN. */
export function present(v: number | null | undefined): v is number {
	return v !== null && v !== undefined && !Number.isNaN(v);
}

/** A text / enum field is documented when it is a non-empty string. */
export function filled(v: string | null | undefined): boolean {
	return typeof v === 'string' && v.trim() !== '';
}

/** Seizure-control label for display. */
export function seizureControlLabel(control: SeizureControl): string {
	switch (control) {
		case 'seizure-free':
			return 'Seizure-free';
		case 'controlled':
			return 'Controlled';
		case 'uncontrolled':
			return 'Uncontrolled';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the seizure-control badge/banner.
 * seizure-free → success; controlled → warning; uncontrolled → error.
 */
export function seizureControlColor(control: SeizureControl): string {
	switch (control) {
		case 'seizure-free':
			return 'bg-success text-success-content border-success';
		case 'controlled':
			return 'bg-warning text-warning-content border-warning';
		case 'uncontrolled':
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

/** Reviewing-clinician role label. */
export function reviewerRoleLabel(role: ReviewerRole): string {
	switch (role) {
		case 'gp':
			return 'General practitioner';
		case 'practice-nurse':
			return 'Practice nurse';
		case 'epilepsy-nurse':
			return 'Epilepsy specialist nurse';
		case 'neurologist':
			return 'Neurologist';
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
		case 'epilepsy-clinic':
			return 'Epilepsy clinic';
		case 'community':
			return 'Community';
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

/** Epilepsy-type label. */
export function epilepsyTypeLabel(type: EpilepsyType): string {
	switch (type) {
		case 'focal':
			return 'Focal';
		case 'generalised':
			return 'Generalised';
		case 'combined':
			return 'Combined';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Seizure-frequency label. */
export function seizureFrequencyLabel(freq: SeizureFrequency): string {
	switch (freq) {
		case 'none':
			return 'None';
		case 'less-than-monthly':
			return 'Less than monthly';
		case 'monthly':
			return 'Monthly';
		case 'weekly':
			return 'Weekly';
		case 'daily':
			return 'Daily';
		default:
			return '';
	}
}

/** Seizure-trend label. */
export function seizureTrendLabel(trend: SeizureTrend): string {
	switch (trend) {
		case 'seizure-free':
			return 'Seizure-free';
		case 'decreasing':
			return 'Decreasing';
		case 'stable':
			return 'Stable';
		case 'increasing':
			return 'Increasing';
		default:
			return '';
	}
}

/** Adherence label. */
export function adherenceLabel(adherence: Adherence): string {
	switch (adherence) {
		case 'good':
			return 'Good';
		case 'partial':
			return 'Partial';
		case 'poor':
			return 'Poor';
		default:
			return '';
	}
}

/** ASM side-effects label. */
export function sideEffectsLabel(effects: SideEffects): string {
	switch (effects) {
		case 'none':
			return 'None';
		case 'mild':
			return 'Mild';
		case 'significant':
			return 'Significant';
		default:
			return '';
	}
}

/** DVLA driving-eligibility label. */
export function dvlaEligibleLabel(eligible: DvlaEligible): string {
	switch (eligible) {
		case 'eligible':
			return 'Eligible';
		case 'not-eligible':
			return 'Not eligible';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return '';
	}
}

/** Pregnancy-Prevention-Programme status label. */
export function pppStatusLabel(status: PppStatus): string {
	switch (status) {
		case 'in-place':
			return 'In place';
		case 'not-in-place':
			return 'Not in place';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return '';
	}
}

/** Mental-health concern label. */
export function mentalHealthConcernLabel(concern: MentalHealthConcern): string {
	switch (concern) {
		case 'none':
			return 'None';
		case 'low-mood':
			return 'Low mood';
		case 'anxiety':
			return 'Anxiety';
		case 'depression':
			return 'Depression';
		case 'suicidality':
			return 'Suicidality';
		default:
			return '';
	}
}
