import type {
	FitnessStatement,
	RestrictionPriority,
	ClinicianRole,
	AbsenceMechanism,
	FunctionalLevel
} from './types';

/** Calculate age (whole years) from a date-of-birth string. Null if invalid. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

/** Human-readable fitness-statement label. */
export function fitnessStatementLabel(s: FitnessStatement): string {
	switch (s) {
		case 'fit':
			return 'Fit for work';
		case 'may-be-fit':
			return 'May be fit for work — with adjustments';
		case 'not-fit':
			return 'Not fit for work';
	}
}

/** Lily-token colour triple for a fitness statement. */
export function fitnessStatementColor(s: FitnessStatement): string {
	switch (s) {
		case 'fit':
			return 'bg-success text-success-content border-success';
		case 'may-be-fit':
			return 'bg-warning text-warning-content border-warning';
		case 'not-fit':
			return 'bg-error text-error-content border-error';
	}
}

/** Human-readable restriction-priority label. */
export function restrictionPriorityLabel(p: RestrictionPriority): string {
	switch (p) {
		case 'routine':
			return 'Routine';
		case 'standard':
			return 'Standard';
		case 'restricted':
			return 'Restricted';
		case 'high-risk':
			return 'High-risk';
	}
}

/** Lily-token colour triple for a restriction priority. */
export function restrictionPriorityColor(p: RestrictionPriority): string {
	switch (p) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'standard':
			return 'bg-info text-info-content border-info';
		case 'restricted':
			return 'bg-warning text-warning-content border-warning';
		case 'high-risk':
			return 'bg-error text-error-content border-error';
	}
}

/** Map a restriction grade (1-4) to its priority key. */
export function gradeToPriority(grade: number): RestrictionPriority {
	if (grade >= 4) return 'high-risk';
	if (grade >= 3) return 'restricted';
	if (grade >= 2) return 'standard';
	return 'routine';
}

/** Restriction-grade label (used by the Badge component on the report). */
export function restrictionGradeLabel(grade: number): string {
	switch (grade) {
		case 1:
			return 'Grade 1 — Routine';
		case 2:
			return 'Grade 2 — Standard';
		case 3:
			return 'Grade 3 — Restricted';
		case 4:
			return 'Grade 4 — High-risk';
		default:
			return `Grade ${grade}`;
	}
}

/** Restriction-grade colour triple (used by the Badge component on the report). */
export function restrictionGradeColor(grade: number): string {
	switch (grade) {
		case 1:
			return 'bg-success text-success-content border-success';
		case 2:
			return 'bg-info text-info-content border-info';
		case 3:
			return 'bg-warning text-warning-content border-warning';
		case 4:
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable clinician-role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'gp':
			return 'General Practitioner';
		case 'oh-physician':
			return 'Occupational-Health Physician';
		case 'hospital-consultant':
			return 'Hospital Consultant';
		case 'nurse':
			return 'Registered Nurse';
		case 'pharmacist':
			return 'Pharmacist';
		case 'physiotherapist':
			return 'Physiotherapist';
		case 'occupational-therapist':
			return 'Occupational Therapist';
		default:
			return 'Not stated';
	}
}

/** Human-readable absence-mechanism label. */
export function mechanismLabel(m: AbsenceMechanism): string {
	switch (m) {
		case 'illness':
			return 'Illness';
		case 'injury':
			return 'Injury';
		case 'surgery':
			return 'Surgery / procedure';
		case 'mental-health':
			return 'Mental health';
		case 'pregnancy-related':
			return 'Pregnancy-related';
		case 'other':
			return 'Other';
		default:
			return 'Not stated';
	}
}

/** Human-readable functional-level label. */
export function functionalLevelLabel(level: FunctionalLevel): string {
	switch (level) {
		case 'full':
			return 'Full / unimpaired';
		case 'mild':
			return 'Mild impairment';
		case 'moderate':
			return 'Moderate impairment';
		case 'severe':
			return 'Severe impairment';
		default:
			return 'Not assessed';
	}
}
