import type {
	AgeBand,
	DiabetesType,
	GraderRole,
	ImagingMedia,
	MaculopathyGrade,
	Outcome,
	PreviousScreenResult,
	Priority,
	Referral,
	RetinopathyGrade,
	Status,
	YesNo
} from './types';

/** Retinopathy (R) grade label for display. */
export function retinopathyLabel(grade: RetinopathyGrade | string): string {
	switch (grade) {
		case 'R0':
			return 'R0 — No diabetic retinopathy';
		case 'R1':
			return 'R1 — Background retinopathy';
		case 'R2':
			return 'R2 — Pre-proliferative retinopathy';
		case 'R3A':
			return 'R3A — Proliferative retinopathy (active)';
		case 'R3S':
			return 'R3S — Proliferative retinopathy (stable / treated)';
		default:
			return '';
	}
}

/** Maculopathy (M) grade label for display. */
export function maculopathyLabel(grade: MaculopathyGrade | string): string {
	switch (grade) {
		case 'M0':
			return 'M0 — No diabetic maculopathy';
		case 'M1':
			return 'M1 — Diabetic maculopathy present';
		default:
			return '';
	}
}

/** Recall / referral outcome label for display. */
export function outcomeLabel(outcome: Outcome | string): string {
	switch (outcome) {
		case 'refer-hes-urgent':
			return 'Urgent referral to ophthalmology (HES)';
		case 'refer-hes':
			return 'Routine referral to hospital eye service (HES)';
		case 'refer-slit-lamp':
			return 'Re-screen / slit-lamp biomicroscopy';
		case 'surveillance-6-month':
			return '6-monthly digital surveillance';
		case 'routine-12-month':
			return 'Routine 12-monthly digital screening';
		case 'routine-24-month':
			return 'Routine 24-monthly (extended, low-risk) screening';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the outcome badge/banner.
 * routine → success; surveillance / slit-lamp → warning; refer-hes → error;
 * urgent → error.
 */
export function outcomeColor(outcome: Outcome | string): string {
	switch (outcome) {
		case 'routine-24-month':
		case 'routine-12-month':
			return 'bg-success text-success-content border-success';
		case 'surveillance-6-month':
		case 'refer-slit-lamp':
			return 'bg-warning text-warning-content border-warning';
		case 'refer-hes':
		case 'refer-hes-urgent':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Referral destination label. */
export function referralLabel(referral: Referral | string): string {
	switch (referral) {
		case 'none':
			return 'No referral';
		case 'hes-routine':
			return 'Hospital eye service (routine)';
		case 'hes-urgent':
			return 'Ophthalmology (urgent / fast-track)';
		case 'slit-lamp':
			return 'Slit-lamp biomicroscopy';
		default:
			return '';
	}
}

/** Recall-interval label. */
export function recallIntervalLabel(months: 6 | 12 | 24 | null): string {
	if (months === 6) return '6 months';
	if (months === 12) return '12 months';
	if (months === 24) return '24 months';
	return 'No routine recall (referral pathway)';
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

/** Grader-role label. */
export function graderRoleLabel(role: GraderRole | string): string {
	switch (role) {
		case 'screener':
			return 'Retinal screener';
		case 'primary-grader':
			return 'Primary grader';
		case 'secondary-grader':
			return 'Secondary grader';
		case 'ophthalmologist':
			return 'Ophthalmologist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Imaging-media label. */
export function imagingMediaLabel(media: ImagingMedia | string): string {
	switch (media) {
		case 'digital-fundus':
			return 'Digital fundus photography';
		case 'mydriatic':
			return 'Mydriatic (dilated)';
		case 'non-mydriatic':
			return 'Non-mydriatic';
		case 'oct':
			return 'Optical coherence tomography (OCT)';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Age-band label. */
export function ageBandLabel(band: AgeBand | string): string {
	switch (band) {
		case 'under-12':
			return 'Under 12 (outside programme)';
		case '12-17':
			return '12-17';
		case '18-64':
			return '18-64';
		case '65-plus':
			return '65 or over';
		default:
			return '';
	}
}

/** Diabetes-type label. */
export function diabetesTypeLabel(type: DiabetesType | string): string {
	switch (type) {
		case 'type-1':
			return 'Type 1';
		case 'type-2':
			return 'Type 2';
		case 'other':
			return 'Other';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Previous-screen-result label. */
export function previousScreenResultLabel(result: PreviousScreenResult | string): string {
	switch (result) {
		case 'r0m0':
			return 'R0/M0 (no retinopathy)';
		case 'background':
			return 'Background (R1)';
		case 'referable':
			return 'Referable disease';
		case 'none':
			return 'No previous screen';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Ungradable (U) marker label. */
export function ungradableLabel(value: YesNo | string): string {
	switch (value) {
		case 'yes':
			return 'Ungradable';
		case 'no':
			return 'Gradable';
		default:
			return '';
	}
}

/** Photocoagulation (P) marker label. */
export function photocoagulationLabel(value: YesNo | string): string {
	switch (value) {
		case 'yes':
			return 'Photocoagulation present';
		case 'no':
			return 'No photocoagulation';
		default:
			return '';
	}
}

/** Completeness-status label. */
export function statusLabel(status: Status): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}
