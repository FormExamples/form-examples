import type {
	AdaptationIntensity,
	FitnessForWork,
	PeriodCompliance,
	Priority,
	Recommendation
} from './types';

/** Calculate age from a date-of-birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (Number.isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
	return age;
}

/** Human-readable fitness-for-work label. */
export function fitnessCategoryLabel(c: FitnessForWork): string {
	switch (c) {
		case 'not_fit':
			return 'Not fit for work';
		case 'may_be_fit':
			return 'May be fit for work';
		default:
			return 'Not assessed';
	}
}

/** Lily-token colour triple for the fitness category. */
export function fitnessCategoryColor(c: FitnessForWork): string {
	switch (c) {
		case 'not_fit':
			return 'bg-warning text-warning-content border-warning';
		case 'may_be_fit':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable adaptation-intensity label. */
export function adaptationIntensityLabel(a: AdaptationIntensity): string {
	switch (a) {
		case 'none':
			return 'None';
		case 'light':
			return 'Light';
		case 'moderate':
			return 'Moderate';
		case 'substantial':
			return 'Substantial';
		case 'comprehensive':
			return 'Comprehensive';
		default:
			return '—';
	}
}

/** Human-readable period-compliance label. */
export function periodComplianceLabel(p: PeriodCompliance): string {
	switch (p) {
		case 'self_cert_range':
			return 'Self-certification range (< 7 days)';
		case 'compliant':
			return 'Compliant';
		case 'long_term':
			return 'Long term (> 4 weeks)';
		case 'very_long_term':
			return 'Very long term (> 6 months)';
		case 'exceeds_initial_max':
			return 'Exceeds 3-month initial maximum';
		default:
			return '—';
	}
}

/** Lily-token colour triple for the period-compliance band. */
export function periodComplianceColor(p: PeriodCompliance): string {
	switch (p) {
		case 'compliant':
			return 'bg-success text-success-content border-success';
		case 'self_cert_range':
			return 'bg-info text-info-content border-info';
		case 'long_term':
			return 'bg-warning text-warning-content border-warning';
		case 'very_long_term':
			return 'bg-warning text-warning-content border-warning';
		case 'exceeds_initial_max':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable engine-recommendation label. */
export function recommendationLabel(r: Recommendation): string {
	switch (r) {
		case 'standard':
			return 'Standard — no referral';
		case 'refer_occupational_health':
			return 'Refer to occupational health';
		case 'refer_access_to_work':
			return 'Refer to Access to Work';
		case 'refer_employment_advisor':
			return 'Refer to employment advisor';
		case 'review_for_validity':
			return 'Review for validity';
		default:
			return '—';
	}
}

/** Lily-token colour triple for the recommendation. */
export function recommendationColor(r: Recommendation): string {
	switch (r) {
		case 'standard':
			return 'bg-success text-success-content border-success';
		case 'refer_occupational_health':
		case 'refer_employment_advisor':
			return 'bg-info text-info-content border-info';
		case 'refer_access_to_work':
			return 'bg-warning text-warning-content border-warning';
		case 'review_for_validity':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour triple for a validity verdict. */
export function validColor(isValid: 'yes' | 'no'): string {
	return isValid === 'yes'
		? 'bg-success text-success-content border-success'
		: 'bg-error text-error-content border-error';
}

/** Lily-token colour triple for a safety-flag priority. */
export function priorityColor(p: Priority): string {
	switch (p) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
