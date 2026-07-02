import type {
	AgeBand,
	AlbuminuriaCategory,
	CareSetting,
	ClinicianRole,
	DiabetesStatus,
	GfrCategory,
	KdigoRiskZone,
	PrimaryCause,
	Priority,
	ReferralDecision,
	ReviewStatus,
	ReviewType,
	Sex
} from './types';

/** A numeric field is present when it is neither null/undefined nor NaN. */
export function present(v: number | null | undefined): v is number {
	return v !== null && v !== undefined && !Number.isNaN(v);
}

/** G-stage label for display. */
export function gfrCategoryLabel(g: GfrCategory): string {
	switch (g) {
		case 'G1':
			return 'G1 (normal or high)';
		case 'G2':
			return 'G2 (mildly decreased)';
		case 'G3a':
			return 'G3a (mild–moderate)';
		case 'G3b':
			return 'G3b (moderate–severe)';
		case 'G4':
			return 'G4 (severely decreased)';
		case 'G5':
			return 'G5 (kidney failure)';
		default:
			return 'Not staged';
	}
}

/** Lily-token colour utility classes for the G-stage badge. */
export function gfrCategoryColor(g: GfrCategory): string {
	switch (g) {
		case 'G1':
		case 'G2':
			return 'bg-success text-success-content border-success';
		case 'G3a':
			return 'bg-warning text-warning-content border-warning';
		case 'G3b':
			return 'bg-error text-error-content border-error';
		case 'G4':
		case 'G5':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Albuminuria-stage label for display. */
export function albuminuriaCategoryLabel(a: AlbuminuriaCategory): string {
	switch (a) {
		case 'A1':
			return 'A1 (normal–mild)';
		case 'A2':
			return 'A2 (moderate)';
		case 'A3':
			return 'A3 (severe)';
		default:
			return 'Not staged';
	}
}

/** Lily-token colour utility classes for the albuminuria-stage badge. */
export function albuminuriaCategoryColor(a: AlbuminuriaCategory): string {
	switch (a) {
		case 'A1':
			return 'bg-success text-success-content border-success';
		case 'A2':
			return 'bg-warning text-warning-content border-warning';
		case 'A3':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** KDIGO risk-zone label for display. */
export function kdigoRiskZoneLabel(zone: KdigoRiskZone): string {
	switch (zone) {
		case 'low':
			return 'Low risk';
		case 'moderate':
			return 'Moderate risk';
		case 'high':
			return 'High risk';
		case 'very-high':
			return 'Very high risk';
		default:
			return 'Not classified';
	}
}

/**
 * Lily-token colour utility classes for the KDIGO risk-zone badge/banner.
 * low → success (green); moderate → warning (amber); high → error (red);
 * very-high → error (dark red) with an accent border.
 */
export function kdigoRiskZoneColor(zone: KdigoRiskZone): string {
	switch (zone) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'very-high':
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
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'gp':
			return 'General practitioner';
		case 'nurse':
			return 'Practice / advanced nurse';
		case 'pharmacist':
			return 'Clinical pharmacist';
		case 'nephrology':
			return 'Nephrology team';
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
		case 'long-term-conditions-clinic':
			return 'Long-term-conditions clinic';
		case 'community-nephrology':
			return 'Community nephrology';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Review-type label. */
export function reviewTypeLabel(type: ReviewType): string {
	switch (type) {
		case 'annual':
			return 'Annual';
		case 'interval':
			return 'Interval';
		case 'post-referral':
			return 'Post-referral';
		default:
			return '';
	}
}

/** Referral-decision label. */
export function referralDecisionLabel(decision: ReferralDecision): string {
	switch (decision) {
		case 'none':
			return 'No referral';
		case 'monitor':
			return 'Continue monitoring';
		case 'refer-nephrology':
			return 'Refer to nephrology';
		case 'already-under-nephrology':
			return 'Already under nephrology';
		default:
			return '';
	}
}

/** Diabetes-status label. */
export function diabetesStatusLabel(status: DiabetesStatus): string {
	switch (status) {
		case 'none':
			return 'None';
		case 'type1':
			return 'Type 1 diabetes';
		case 'type2':
			return 'Type 2 diabetes';
		default:
			return '';
	}
}

/** Primary-cause label. */
export function primaryCauseLabel(cause: PrimaryCause): string {
	switch (cause) {
		case 'diabetic':
			return 'Diabetic';
		case 'hypertensive':
			return 'Hypertensive';
		case 'glomerular':
			return 'Glomerular';
		case 'polycystic':
			return 'Polycystic';
		case 'obstructive':
			return 'Obstructive';
		case 'unknown':
			return 'Unknown';
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
