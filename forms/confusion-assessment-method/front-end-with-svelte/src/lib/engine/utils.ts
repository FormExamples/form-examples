import type {
	AgeBand,
	AssessorRole,
	AttentionTest,
	CamVariant,
	Classification,
	CognitiveBaseline,
	CollateralSource,
	ConsciousnessLevel,
	FeatureState,
	MotoricSubtype,
	OnsetTiming,
	Priority,
	Sex
} from './types';

/** Classification label for display. */
export function classificationLabel(classification: Classification): string {
	switch (classification) {
		case 'present':
			return 'Delirium present';
		case 'absent':
			return 'Delirium absent';
		case 'unable-to-assess':
			return 'Unable to assess';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the classification badge/banner.
 * present → error; absent → success; unable-to-assess → warning.
 */
export function classificationColor(classification: Classification): string {
	switch (classification) {
		case 'present':
			return 'bg-error text-error-content border-error';
		case 'absent':
			return 'bg-success text-success-content border-success';
		case 'unable-to-assess':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Present / absent label for a single feature state. */
export function featureStateLabel(state: FeatureState): string {
	switch (state) {
		case 'present':
			return 'Present';
		case 'absent':
			return 'Absent';
		default:
			return 'Not recorded';
	}
}

/** Lily-token colour utility classes for a feature-status pill. */
export function featureStateColor(positive: boolean | null): string {
	if (positive === null) return 'bg-base-300 text-base-content border-base-300';
	return positive
		? 'bg-error text-error-content border-error'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Short label for one of the four CAM features. */
export function featureLabel(n: number): string {
	switch (n) {
		case 1:
			return 'Feature 1 — acute onset and fluctuating course';
		case 2:
			return 'Feature 2 — inattention';
		case 3:
			return 'Feature 3 — disorganised thinking';
		case 4:
			return 'Feature 4 — altered level of consciousness';
		default:
			return '';
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

/** Assessor role label. */
export function assessorRoleLabel(role: AssessorRole): string {
	switch (role) {
		case 'nurse':
			return 'Nurse';
		case 'doctor':
			return 'Doctor';
		case 'geriatrician':
			return 'Geriatrician';
		case 'liaison-psychiatrist':
			return 'Liaison psychiatrist';
		case 'physiotherapist':
			return 'Physiotherapist';
		case 'occupational-therapist':
			return 'Occupational therapist';
		case 'researcher':
			return 'Researcher';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** CAM variant label. */
export function camVariantLabel(variant: CamVariant): string {
	switch (variant) {
		case 'cam':
			return 'CAM (standard bedside)';
		case 'cam-icu':
			return 'CAM-ICU (ventilated / non-verbal)';
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

/** Cognitive-baseline label. */
export function cognitiveBaselineLabel(value: CognitiveBaseline): string {
	switch (value) {
		case 'independent':
			return 'Independent';
		case 'known-dementia':
			return 'Known dementia';
		case 'mild-cognitive-impairment':
			return 'Mild cognitive impairment';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Collateral-history source label. */
export function collateralSourceLabel(value: CollateralSource): string {
	switch (value) {
		case 'family':
			return 'Family';
		case 'carer':
			return 'Carer';
		case 'nurse':
			return 'Nurse';
		case 'notes':
			return 'Case notes';
		case 'none':
			return 'None available';
		default:
			return '';
	}
}

/** Onset-timing label. */
export function onsetTimingLabel(value: OnsetTiming): string {
	switch (value) {
		case 'hours':
			return 'Hours';
		case 'days':
			return 'Days';
		case 'weeks':
			return 'Weeks';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Attention-test label. */
export function attentionTestLabel(value: AttentionTest): string {
	switch (value) {
		case 'digit-span':
			return 'Digit span';
		case 'months-backwards':
			return 'Months of the year backwards';
		case 'serial-sevens':
			return 'Serial sevens';
		case 'attention-screening-examination':
			return 'Attention Screening Examination (CAM-ICU)';
		case 'not-completable':
			return 'Not completable';
		default:
			return '';
	}
}

/** Consciousness-level label. */
export function consciousnessLevelLabel(value: ConsciousnessLevel): string {
	switch (value) {
		case 'alert':
			return 'Alert';
		case 'vigilant':
			return 'Vigilant (hyperalert)';
		case 'lethargic':
			return 'Lethargic (drowsy, easily roused)';
		case 'stupor':
			return 'Stupor (difficult to rouse)';
		case 'coma':
			return 'Coma (unrousable)';
		default:
			return '';
	}
}

/** Motoric-subtype label. */
export function motoricSubtypeLabel(value: MotoricSubtype): string {
	switch (value) {
		case 'hypoactive':
			return 'Hypoactive';
		case 'hyperactive':
			return 'Hyperactive';
		case 'mixed':
			return 'Mixed';
		case 'normal':
			return 'Normal psychomotor activity';
		default:
			return '';
	}
}
