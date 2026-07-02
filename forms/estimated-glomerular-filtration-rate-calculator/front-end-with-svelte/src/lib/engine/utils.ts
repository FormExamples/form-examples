import type {
	CareSetting,
	ClinicianRole,
	Equation,
	GStage,
	Priority,
	Sex
} from './types';

/** CKD G-stage label for display. */
export function stageLabel(stage: GStage): string {
	switch (stage) {
		case 'G1':
			return 'G1 — Normal or high (≥ 90)';
		case 'G2':
			return 'G2 — Mildly decreased (60–89)';
		case 'G3a':
			return 'G3a — Mildly to moderately decreased (45–59)';
		case 'G3b':
			return 'G3b — Moderately to severely decreased (30–44)';
		case 'G4':
			return 'G4 — Severely decreased (15–29)';
		case 'G5':
			return 'G5 — Kidney failure (< 15)';
		default:
			return 'Awaiting required inputs';
	}
}

/**
 * Lily-token colour utility classes for the stage badge/banner.
 * G1/G2 → success; G3a/G3b → warning; G4/G5 → error; none → neutral.
 */
export function stageColor(stage: GStage): string {
	switch (stage) {
		case 'G1':
		case 'G2':
			return 'bg-success text-success-content border-success';
		case 'G3a':
		case 'G3b':
			return 'bg-warning text-warning-content border-warning';
		case 'G4':
		case 'G5':
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

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'pharmacist':
			return 'Pharmacist';
		case 'laboratory':
			return 'Laboratory staff';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'primary-care':
			return 'Primary care';
		case 'secondary-care':
			return 'Secondary care';
		case 'laboratory':
			return 'Laboratory';
		case 'pharmacy':
			return 'Pharmacy';
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
		default:
			return '';
	}
}

/** Estimating-equation label. */
export function equationLabel(equation: Equation): string {
	switch (equation) {
		case 'ckd-epi-2021-creatinine':
			return 'CKD-EPI 2021 creatinine (race-free)';
		case 'ckd-epi-2021-cystatin-c':
			return 'CKD-EPI 2021 cystatin C';
		case 'mdrd':
			return 'MDRD (4-variable)';
		default:
			return '';
	}
}

/**
 * Format an eGFR value for display, or a dash when null. Uses the UK "> 90"
 * convention above 90 while the numeric value is retained for banding.
 */
export function formatEgfr(egfr: number | null): string {
	if (egfr === null || egfr === undefined) return '—';
	if (egfr >= 90) return '> 90 mL/min/1.73 m²';
	return `${Math.round(egfr)} mL/min/1.73 m²`;
}
