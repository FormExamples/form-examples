import type {
	AgeBand,
	CompletenessStatus,
	ConsultedStatus,
	Conveyance,
	Criterion,
	Location,
	Outcome,
	Priority,
	RecommendedSection,
	RecommendedSectionClass,
	RiskImminence,
	Sex,
	UrgencyClass
} from './types';

/** Completeness-status label for display. */
export function completenessStatusLabel(status: CompletenessStatus): string {
	switch (status) {
		case 'valid':
			return 'Valid';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for the completeness-status badge/banner. */
export function completenessStatusColor(status: CompletenessStatus): string {
	switch (status) {
		case 'valid':
			return 'bg-success text-success-content border-success';
		case 'incomplete':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Full recommended-section-class label. */
export function sectionClassLabel(cls: RecommendedSectionClass): string {
	switch (cls) {
		case 'section-2':
			return 'Section 2 — admission for assessment (up to 28 days)';
		case 'section-3':
			return 'Section 3 — admission for treatment (up to 6 months)';
		case 'section-4':
			return 'Section 4 — emergency admission for assessment (up to 72 hours)';
		case 'section-5-2':
			return 'Section 5(2) — doctor’s holding power (up to 72 hours)';
		case 'section-5-4':
			return 'Section 5(4) — nurse’s holding power (up to 6 hours)';
		case 'section-136':
			return 'Section 136 — police place-of-safety power (up to 24 hours)';
		case 'none':
			return 'No detaining section (informal admission or community outcome)';
		default:
			return '';
	}
}

/** Short recommended-section-class label for the dashboard. */
export function sectionClassShort(cls: RecommendedSectionClass): string {
	switch (cls) {
		case 'section-2':
			return 'Section 2';
		case 'section-3':
			return 'Section 3';
		case 'section-4':
			return 'Section 4';
		case 'section-5-2':
			return 'Section 5(2)';
		case 'section-5-4':
			return 'Section 5(4)';
		case 'section-136':
			return 'Section 136';
		case 'none':
			return 'None';
		default:
			return 'N/A';
	}
}

/** Lily-token colour utility classes for the recommended-section-class pill. */
export function sectionClassColor(cls: RecommendedSectionClass): string {
	if (cls === 'none') return 'bg-base-300 text-base-content border-base-300';
	return 'bg-primary text-primary-content border-primary';
}

/** Urgency-class label. */
export function urgencyLabel(urgency: UrgencyClass): string {
	switch (urgency) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for the urgency badge. */
export function urgencyColor(urgency: UrgencyClass): string {
	switch (urgency) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Criterion (met / not-met / not-applicable) label. */
export function criterionLabel(value: Criterion): string {
	switch (value) {
		case 'met':
			return 'Met';
		case 'not-met':
			return 'Not met';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Not recorded';
	}
}

/** Lily-token colour utility classes for a criterion / signatory status pill. */
export function criterionColor(met: boolean | null): string {
	if (met === null) return 'bg-base-300 text-base-content border-base-300';
	return met
		? 'bg-success text-success-content border-success'
		: 'bg-error text-error-content border-error';
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

/** Location / setting label. */
export function locationLabel(value: Location): string {
	switch (value) {
		case 'hospital-ward':
			return 'Hospital ward';
		case 'emergency-department':
			return 'Emergency department';
		case 'place-of-safety':
			return 'Place of safety (s136 suite)';
		case 'care-home':
			return 'Care home';
		case 'community':
			return 'Community / person’s home';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Age-band label. */
export function ageBandLabel(value: AgeBand): string {
	switch (value) {
		case 'child':
			return 'Child';
		case 'adolescent':
			return 'Adolescent';
		case 'adult':
			return 'Adult';
		case 'older-adult':
			return 'Older adult';
		default:
			return '';
	}
}

/** Patient-sex label. */
export function sexLabel(value: Sex): string {
	switch (value) {
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

/** Risk-imminence label. */
export function imminenceLabel(value: RiskImminence): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'imminent':
			return 'Imminent';
		default:
			return '';
	}
}

/** Recommended-section (raw enum) label. */
export function recommendedSectionLabel(value: RecommendedSection): string {
	switch (value) {
		case '2':
			return 'Section 2 — admission for assessment (28 days)';
		case '3':
			return 'Section 3 — admission for treatment (6 months)';
		case '4':
			return 'Section 4 — emergency admission (72 hours)';
		case '5-2':
			return 'Section 5(2) — doctor’s holding power (72 hours)';
		case '5-4':
			return 'Section 5(4) — nurse’s holding power (6 hours)';
		case '136':
			return 'Section 136 — police place-of-safety power (24 hours)';
		case 'none':
			return 'None — informal admission or community outcome';
		default:
			return '';
	}
}

/** Outcome label. */
export function outcomeLabel(value: Outcome): string {
	switch (value) {
		case 'detain-under-section':
			return 'Detain under section';
		case 'informal-admission':
			return 'Informal admission';
		case 'community':
			return 'Community / care in the community';
		case 'no-action':
			return 'No action';
		default:
			return '';
	}
}

/** Conveyance label. */
export function conveyanceLabel(value: Conveyance): string {
	switch (value) {
		case 'ambulance':
			return 'Ambulance';
		case 'police':
			return 'Police';
		case 'self':
			return 'Self / own transport';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Consulted-status label. */
export function consultedLabel(value: ConsultedStatus): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		case 'not-practicable':
			return 'Not practicable';
		default:
			return '';
	}
}

/** Yes / No / Unknown label (also covers the objection tri-state). */
export function yesNoLabel(value: string): string {
	switch (value) {
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
