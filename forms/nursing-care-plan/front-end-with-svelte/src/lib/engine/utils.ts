import type {
	ActualOrPotential,
	CareSetting,
	CarriedOut,
	CompletenessClass,
	Goal,
	Intervention,
	LinkedRisk,
	MetStatus,
	NurseRole,
	PlanStatus,
	PlanType,
	Priority,
	Problem,
	RiskGroup,
	RiskLevel,
	Sex
} from './types';

// ──────────────────────────────────────────────
// Unique id + empty-row factories for the repeating child rows
// ──────────────────────────────────────────────

let _seq = 0;

/** Monotonic-ish unique id for a newly-created problem / goal / intervention row. */
export function uid(prefix = 'row'): string {
	_seq += 1;
	return `${prefix}-${Date.now().toString(36)}-${_seq}`;
}

/** A fresh, fully-blank risk-assessment group. */
export function createDefaultRiskGroup(): RiskGroup {
	return { done: '', level: '', assessedOn: '', actioned: '' };
}

/** A fresh, fully-blank SMART goal. */
export function createDefaultGoal(): Goal {
	return { id: uid('goal'), goalText: '', targetDate: '', met: '' };
}

/** A fresh, fully-blank intervention. */
export function createDefaultIntervention(): Intervention {
	return { id: uid('intervention'), interventionText: '', carriedOut: '' };
}

/** A fresh, fully-blank problem (with empty goal / intervention arrays). */
export function createDefaultProblem(): Problem {
	return {
		id: uid('problem'),
		problemStatement: '',
		adlCategory: '',
		actualOrPotential: '',
		assessmentData: '',
		linkedRisk: '',
		goals: [],
		interventions: [],
		evaluationNote: '',
		goalMet: '',
		nextReviewDate: ''
	};
}

// ──────────────────────────────────────────────
// Shared enumerations for the wizard UI
// ──────────────────────────────────────────────

/** Roper–Logan–Tierney activities of living. */
export const ADL_CATEGORIES: { value: string; label: string }[] = [
	{ value: 'safe-environment', label: 'Maintaining a safe environment' },
	{ value: 'communication', label: 'Communication' },
	{ value: 'breathing', label: 'Breathing' },
	{ value: 'eating-drinking', label: 'Eating and drinking' },
	{ value: 'elimination', label: 'Elimination' },
	{ value: 'personal-cleansing-dressing', label: 'Personal cleansing and dressing' },
	{ value: 'body-temperature', label: 'Controlling body temperature' },
	{ value: 'mobilising', label: 'Mobilising' },
	{ value: 'working-playing', label: 'Working and playing' },
	{ value: 'expressing-sexuality', label: 'Expressing sexuality' },
	{ value: 'sleeping', label: 'Sleeping' },
	{ value: 'dying', label: 'Dying' },
	{ value: 'other', label: 'Other' }
];

// ──────────────────────────────────────────────
// Completeness / status label + colour helpers
// ──────────────────────────────────────────────

/** Human label for a plan / problem completeness value. */
export function completenessLabel(value: CompletenessClass | PlanStatus): string {
	switch (value) {
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
 * Lily-token colour utility classes for a completeness / status badge or banner.
 * complete → success; partial → warning; incomplete → error.
 */
export function completenessColor(value: CompletenessClass | PlanStatus): string {
	switch (value) {
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

// ──────────────────────────────────────────────
// Enum → display-label helpers
// ──────────────────────────────────────────────

/** Label for an RLT activity-of-living value. */
export function adlCategoryLabel(value: string): string {
	const found = ADL_CATEGORIES.find((o) => o.value === value);
	return found ? found.label : '';
}

export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'Low';
		case 'medium':
			return 'Medium';
		case 'high':
			return 'High';
		default:
			return '';
	}
}

export function nurseRoleLabel(role: NurseRole): string {
	switch (role) {
		case 'registered-nurse':
			return 'Registered nurse';
		case 'nursing-associate':
			return 'Nursing associate';
		case 'student-nurse':
			return 'Student nurse';
		default:
			return '';
	}
}

export function planTypeLabel(t: PlanType): string {
	switch (t) {
		case 'admission':
			return 'Admission';
		case 'ongoing':
			return 'Ongoing';
		case 'discharge':
			return 'Discharge';
		default:
			return '';
	}
}

export function careSettingLabel(s: CareSetting): string {
	switch (s) {
		case 'hospital-ward':
			return 'Hospital ward';
		case 'community':
			return 'Community / district nursing';
		case 'care-home':
			return 'Care home';
		case 'hospice':
			return 'Hospice';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

export function sexLabel(s: Sex): string {
	switch (s) {
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

export function actualOrPotentialLabel(v: ActualOrPotential): string {
	switch (v) {
		case 'actual':
			return 'Actual';
		case 'potential':
			return 'Potential';
		default:
			return '';
	}
}

export function linkedRiskLabel(v: LinkedRisk): string {
	switch (v) {
		case 'none':
			return 'None';
		case 'falls':
			return 'Falls';
		case 'pressure-ulcer':
			return 'Pressure ulcer';
		case 'vte':
			return 'Venous thromboembolism (VTE)';
		case 'nutrition':
			return 'Nutrition (MUST)';
		default:
			return '';
	}
}

export function metStatusLabel(m: MetStatus): string {
	switch (m) {
		case 'met':
			return 'Met';
		case 'partially-met':
			return 'Partially met';
		case 'not-met':
			return 'Not met';
		case 'not-evaluated':
			return 'Not evaluated';
		default:
			return '';
	}
}

export function carriedOutLabel(c: CarriedOut): string {
	switch (c) {
		case 'yes':
			return 'Carried out';
		case 'no':
			return 'Not carried out';
		case 'partial':
			return 'Partially carried out';
		default:
			return '';
	}
}
