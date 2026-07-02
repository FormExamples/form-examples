import type {
	CareSetting,
	ComponentResult,
	ExaminationContext,
	NormalAbnormal,
	OverallOutcome,
	PractitionerRole,
	Priority,
	Sex,
	TestesResult,
	Urgency
} from './types';

/** Overall screening-outcome label for display. */
export function outcomeLabel(outcome: OverallOutcome): string {
	switch (outcome) {
		case 'satisfactory':
			return 'Satisfactory';
		case 'refer':
			return 'Refer';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the overall-outcome badge/banner.
 * satisfactory → success; refer → error; incomplete → warning.
 */
export function outcomeColor(outcome: OverallOutcome): string {
	switch (outcome) {
		case 'satisfactory':
			return 'bg-success text-success-content border-success';
		case 'refer':
			return 'bg-error text-error-content border-error';
		case 'incomplete':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Per-component result label for display. */
export function componentResultLabel(result: TestesResult): string {
	switch (result) {
		case 'satisfactory':
			return 'Satisfactory';
		case 'refer':
			return 'Refer';
		case 'not-examined':
			return 'Not examined';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for a per-component result pill. */
export function componentResultColor(result: TestesResult): string {
	switch (result) {
		case 'satisfactory':
			return 'bg-success text-success-content border-success';
		case 'refer':
			return 'bg-error text-error-content border-error';
		case 'not-examined':
			return 'bg-warning text-warning-content border-warning';
		case 'not-applicable':
			return 'bg-base-300 text-base-content border-base-300';
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

/** Referral-urgency label. */
export function urgencyLabel(urgency: Urgency): string {
	switch (urgency) {
		case 'same-day':
			return 'Same day';
		case 'within-2-weeks':
			return 'Within 2 weeks';
		case 'by-6-weeks':
			return 'By 6 weeks of age';
		case 'review-6-8-weeks':
			return 'Review at 6-8 weeks';
		default:
			return '';
	}
}

/** Lily-token colour classes for a referral urgency (same-day is most urgent). */
export function urgencyColor(urgency: Urgency): string {
	switch (urgency) {
		case 'same-day':
			return 'bg-error text-error-content border-error';
		case 'within-2-weeks':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Component key → display label. */
export function componentLabel(component: string): string {
	switch (component) {
		case 'eyes':
			return 'Eyes';
		case 'heart':
			return 'Heart';
		case 'hips':
			return 'Hips';
		case 'testes':
			return 'Testes';
		case 'overall':
			return 'Overall';
		default:
			return component;
	}
}

/** Examining-practitioner role label. */
export function practitionerRoleLabel(role: PractitionerRole): string {
	switch (role) {
		case 'midwife':
			return 'Midwife';
		case 'neonatal-nurse':
			return 'Neonatal nurse';
		case 'paediatrician':
			return 'Paediatrician';
		case 'gp':
			return 'GP';
		case 'nurse-practitioner':
			return 'Nurse practitioner';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'maternity-ward':
			return 'Maternity ward';
		case 'neonatal-unit':
			return 'Neonatal unit';
		case 'community':
			return 'Community / midwife-led clinic';
		case 'gp-surgery':
			return 'GP surgery';
		case 'home':
			return 'Home visit';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Examination-context label. */
export function examinationContextLabel(context: ExaminationContext): string {
	switch (context) {
		case 'newborn-72h':
			return 'Newborn (within 72 hours)';
		case 'infant-6-8-week':
			return 'Infant (6-8 week review)';
		default:
			return '';
	}
}

/** Baby-sex label. */
export function sexLabel(sex: Sex): string {
	switch (sex) {
		case 'male':
			return 'Male';
		case 'female':
			return 'Female';
		case 'indeterminate':
			return 'Indeterminate';
		default:
			return '';
	}
}

/** Normal / abnormal / not-examined tri-state label. */
export function normalAbnormalLabel(value: NormalAbnormal): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'abnormal':
			return 'Abnormal';
		case 'not-examined':
			return 'Not examined';
		default:
			return 'Not recorded';
	}
}

/** Convenience: recorded component-result label used on the report table. */
export function recordedResultLabel(result: ComponentResult | ''): string {
	return result === '' ? 'Not recorded' : componentResultLabel(result);
}
