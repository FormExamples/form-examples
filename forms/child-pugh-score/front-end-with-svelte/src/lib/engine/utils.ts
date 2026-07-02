import type {
	Aetiology,
	AgeBand,
	Ascites,
	CareSetting,
	ChildPughClass,
	ClinicianRole,
	Encephalopathy,
	ParameterPoint,
	Priority,
	Sex,
	SurgicalRisk
} from './types';

/** Child-Pugh class label for display. */
export function childPughClassLabel(cls: ChildPughClass | ''): string {
	switch (cls) {
		case 'A':
			return 'Class A (well-compensated)';
		case 'B':
			return 'Class B (significant compromise)';
		case 'C':
			return 'Class C (decompensated)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the class badge/banner.
 * A → success; B → warning; C → error.
 */
export function childPughClassColor(cls: ChildPughClass | ''): string {
	switch (cls) {
		case 'A':
			return 'bg-success text-success-content border-success';
		case 'B':
			return 'bg-warning text-warning-content border-warning';
		case 'C':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Peri-operative surgical-risk label. */
export function surgicalRiskLabel(risk: SurgicalRisk | ''): string {
	switch (risk) {
		case 'low':
			return 'Low (~10%)';
		case 'moderate':
			return 'Moderate (~30%)';
		case 'high':
			return 'High (~80%)';
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
		case 'hepatologist':
			return 'Hepatologist';
		case 'surgeon':
			return 'Surgeon';
		case 'anaesthetist':
			return 'Anaesthetist';
		case 'physician':
			return 'Physician';
		case 'nurse':
			return 'Specialist nurse';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'hepatology-clinic':
			return 'Hepatology / gastroenterology clinic';
		case 'ward':
			return 'General / acute ward';
		case 'pre-operative':
			return 'Pre-operative assessment';
		case 'intensive-care':
			return 'Intensive care';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Aetiology-of-liver-disease label. */
export function aetiologyLabel(aetiology: Aetiology): string {
	switch (aetiology) {
		case 'alcohol':
			return 'Alcohol-related';
		case 'viral-hepatitis':
			return 'Viral hepatitis';
		case 'nafld':
			return 'NAFLD / MASLD';
		case 'autoimmune':
			return 'Autoimmune';
		case 'cholestatic':
			return 'Cholestatic';
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

/** Adult age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case '16-39':
			return '16-39';
		case '40-59':
			return '40-59';
		case '60-74':
			return '60-74';
		case '75-plus':
			return '75 and over';
		default:
			return '';
	}
}

/** Ascites-grade label. */
export function ascitesLabel(grade: Ascites): string {
	switch (grade) {
		case 'none':
			return 'None';
		case 'mild':
			return 'Mild (diuretic-responsive)';
		case 'moderate-severe':
			return 'Moderate-to-severe (refractory)';
		default:
			return '';
	}
}

/** Hepatic-encephalopathy-grade label. */
export function encephalopathyLabel(grade: Encephalopathy): string {
	switch (grade) {
		case 'none':
			return 'None';
		case 'grade-1-2':
			return 'Grade 1-2 (or medically controlled)';
		case 'grade-3-4':
			return 'Grade 3-4 (or refractory)';
		default:
			return '';
	}
}

/** Format a per-parameter point award (1-3), or a dash when unscored. */
export function formatPoint(point: ParameterPoint): string {
	return point === null || point === undefined ? '—' : `${point} pt`;
}

/** Format a Child-Pugh total, appending "(partial)" while incomplete. */
export function formatScore(score: number, complete: boolean): string {
	return `${score}${complete ? '' : ' (partial)'}`;
}
