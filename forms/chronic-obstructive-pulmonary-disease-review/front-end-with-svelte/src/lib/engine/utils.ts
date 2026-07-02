import type {
	AbeGroup,
	AgeBand,
	Axis,
	ClinicianRole,
	GoldGrade,
	Priority,
	ReviewStatus,
	ReviewType,
	Sex
} from './types';

// ──────────────────────────────────────────────
// GOLD airflow-limitation grade
// ──────────────────────────────────────────────

/** Full GOLD airflow-limitation grade label. */
export function goldGradeLabel(grade: GoldGrade): string {
	switch (grade) {
		case 1:
			return 'GOLD 1 — mild (FEV₁ % predicted ≥ 80)';
		case 2:
			return 'GOLD 2 — moderate (FEV₁ % predicted 50–79)';
		case 3:
			return 'GOLD 3 — severe (FEV₁ % predicted 30–49)';
		case 4:
			return 'GOLD 4 — very severe (FEV₁ % predicted < 30)';
		default:
			return 'GOLD grade not assigned';
	}
}

/** Short GOLD grade label for badges / dashboards. */
export function goldGradeShort(grade: GoldGrade): string {
	return grade === null || grade === undefined ? 'N/A' : `GOLD ${grade}`;
}

/** Lily-token colour utility classes for the GOLD-grade badge. */
export function goldGradeColor(grade: GoldGrade): string {
	switch (grade) {
		case 1:
			return 'bg-success text-success-content border-success';
		case 2:
			return 'bg-warning text-warning-content border-warning';
		case 3:
		case 4:
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

// ──────────────────────────────────────────────
// ABE assessment group
// ──────────────────────────────────────────────

/** Full ABE assessment-group label. */
export function abeGroupLabel(group: AbeGroup): string {
	switch (group) {
		case 'A':
			return 'Group A — low symptoms, low exacerbation risk';
		case 'B':
			return 'Group B — high symptoms, low exacerbation risk';
		case 'E':
			return 'Group E — high exacerbation risk';
		default:
			return 'ABE group not assigned';
	}
}

/** Short ABE label for badges / dashboards. */
export function abeGroupShort(group: AbeGroup): string {
	return group ? `Group ${group}` : 'N/A';
}

/** Lily-token colour utility classes for the ABE-group badge. */
export function abeGroupColor(group: AbeGroup): string {
	switch (group) {
		case 'A':
			return 'bg-success text-success-content border-success';
		case 'B':
			return 'bg-warning text-warning-content border-warning';
		case 'E':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

// ──────────────────────────────────────────────
// Review-completeness grade
// ──────────────────────────────────────────────

/** Review-completeness label. */
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

// ──────────────────────────────────────────────
// Symptom / exacerbation axis
// ──────────────────────────────────────────────

/** Symptom / exacerbation axis label. */
export function axisLabel(axis: Axis): string {
	switch (axis) {
		case 'high':
			return 'High';
		case 'low':
			return 'Low';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for an axis badge. */
export function axisColor(axis: Axis): string {
	return axis === 'high'
		? 'bg-error text-error-content border-error'
		: 'bg-success text-success-content border-success';
}

// ──────────────────────────────────────────────
// Flag priority
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// Enum labels
// ──────────────────────────────────────────────

/** Reviewing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'gp':
			return 'GP';
		case 'practice-nurse':
			return 'Practice nurse';
		case 'respiratory-nurse':
			return 'Respiratory nurse';
		case 'pharmacist':
			return 'Clinical pharmacist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Review-type label. */
export function reviewTypeLabel(type: ReviewType): string {
	switch (type) {
		case 'routine-annual':
			return 'Routine annual';
		case 'post-exacerbation':
			return 'Post-exacerbation';
		case 'opportunistic':
			return 'Opportunistic';
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
