import type {
	AgeBand,
	AssistanceNeeded,
	Band,
	CareSetting,
	ClinicianRole,
	PerinatalStage,
	Priority
} from './types';

/** Interpretation-band label for display. */
export function bandLabel(band: Band): string {
	switch (band) {
		case 'lower':
			return 'Lower likelihood (0-9)';
		case 'possible':
			return 'Possible depression (10-12)';
		case 'likely':
			return 'Likely depression (13-30)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the band badge/banner.
 * lower → success; possible → warning; likely → error.
 */
export function bandColor(band: Band): string {
	switch (band) {
		case 'lower':
			return 'bg-success text-success-content border-success';
		case 'possible':
			return 'bg-warning text-warning-content border-warning';
		case 'likely':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a single item score pill (0..3). */
export function itemScoreColor(score: number): string {
	if (score >= 2) return 'bg-error text-error-content border-error';
	if (score === 1) return 'bg-warning text-warning-content border-warning';
	return 'bg-base-300 text-base-content border-base-300';
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
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
		case 'urgent':
			return 'URGENT';
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

/** Administering-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'midwife':
			return 'Midwife';
		case 'health-visitor':
			return 'Health visitor';
		case 'gp':
			return 'General practitioner';
		case 'perinatal-mh':
			return 'Perinatal mental-health practitioner';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'maternity':
			return 'Maternity service';
		case 'community':
			return 'Community / health visiting';
		case 'general-practice':
			return 'General practice';
		case 'perinatal-mh':
			return 'Perinatal mental-health service';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Perinatal-stage label. */
export function perinatalStageLabel(stage: PerinatalStage): string {
	switch (stage) {
		case 'antenatal':
			return 'Antenatal (during pregnancy)';
		case 'postnatal':
			return 'Postnatal (after birth)';
		default:
			return '';
	}
}

/** Respondent age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case 'under-20':
			return 'Under 20';
		case '20-29':
			return '20-29';
		case '30-39':
			return '30-39';
		case '40-plus':
			return '40 and over';
		default:
			return '';
	}
}

/** Assistance-needed label. */
export function assistanceNeededLabel(value: AssistanceNeeded): string {
	switch (value) {
		case 'none':
			return 'None — self-completed';
		case 'interpreter':
			return 'Interpreter';
		case 'clinician-read':
			return 'Clinician read the items aloud';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}
