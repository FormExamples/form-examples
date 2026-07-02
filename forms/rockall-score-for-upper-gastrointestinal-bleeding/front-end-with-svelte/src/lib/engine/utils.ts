import type {
	CareSetting,
	ClinicianRole,
	Comorbidity,
	Diagnosis,
	Priority,
	RiskBand,
	Sex,
	Stigmata,
	YesNo
} from './types';

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand | ''): string {
	switch (band) {
		case 'low':
			return 'Low risk';
		case 'intermediate':
			return 'Intermediate risk';
		case 'high':
			return 'High risk';
		case 'clinical-only':
			return 'Clinical score only (pre-endoscopy)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * low → success; intermediate / clinical-only → warning; high → error.
 */
export function riskBandColor(band: RiskBand | ''): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'intermediate':
			return 'bg-warning text-warning-content border-warning';
		case 'clinical-only':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
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
		case 'gastroenterologist':
			return 'Gastroenterologist';
		case 'endoscopist':
			return 'Endoscopist';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'emergency-department':
			return 'Emergency department';
		case 'ward':
			return 'Acute / gastroenterology ward';
		case 'endoscopy-unit':
			return 'Endoscopy unit';
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

/** Comorbidity label. */
export function comorbidityLabel(value: Comorbidity): string {
	switch (value) {
		case 'none':
			return 'No major comorbidity';
		case 'major':
			return 'Cardiac failure, ischaemic heart disease, or any major comorbidity';
		case 'severe':
			return 'Renal failure, liver failure, or disseminated malignancy';
		default:
			return '';
	}
}

/** Endoscopy-performed label. */
export function endoscopyPerformedLabel(value: YesNo): string {
	switch (value) {
		case 'yes':
			return 'Endoscopy performed';
		case 'no':
			return 'Endoscopy not yet performed';
		default:
			return '';
	}
}

/** Endoscopic-diagnosis label. */
export function diagnosisLabel(value: Diagnosis): string {
	switch (value) {
		case 'mallory-weiss-or-none':
			return 'Mallory-Weiss tear or no lesion / no stigmata';
		case 'all-other':
			return 'All other diagnoses';
		case 'upper-gi-malignancy':
			return 'Malignancy of the upper GI tract';
		default:
			return '';
	}
}

/** Stigmata-of-recent-haemorrhage label. */
export function stigmataLabel(value: Stigmata): string {
	switch (value) {
		case 'none-or-dark-spot':
			return 'None, or dark spot only';
		case 'high-risk':
			return 'Blood, adherent clot, or visible / spurting vessel';
		default:
			return '';
	}
}

/** Human label for the derived shock band (0/1/2 points). */
export function shockLabel(points: 0 | 1 | 2): string {
	switch (points) {
		case 2:
			return 'Hypotension (systolic BP < 100 mmHg)';
		case 1:
			return 'Tachycardia (heart rate >= 100 bpm)';
		case 0:
			return 'No shock';
		default:
			return '';
	}
}

/** Format a Rockall total for display: full score of 11, or clinical of 7. */
export function formatScore(result: {
	fullRockallScore: number | null;
	clinicalRockallScore: number;
	endoscopyDone: boolean;
}): string {
	return result.endoscopyDone && result.fullRockallScore !== null
		? `${result.fullRockallScore} / 11`
		: `${result.clinicalRockallScore} / 7`;
}
