import type {
	TestType,
	Indication,
	ClinicianRole,
	AorticStenosis,
	Setting,
	AppropriatenessBand,
	ContraindicationBand,
	TriageTier,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Test-type predicate
// ──────────────────────────────────────────────

/**
 * True when the requested test is an exercise (non-pharmacological) modality
 * that requires the patient to be able to exercise.
 */
export function isExerciseTest(testType: TestType | string): boolean {
	return testType === 'exercise-treadmill-ecg' || testType === 'stress-echo';
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable test-type label. */
export function testTypeLabel(value: TestType | string): string {
	switch (value) {
		case 'exercise-treadmill-ecg':
			return 'Exercise treadmill ECG';
		case 'stress-echo':
			return 'Stress echocardiography';
		case 'dobutamine-stress-echo':
			return 'Dobutamine stress echo';
		case 'myocardial-perfusion-spect':
			return 'Myocardial perfusion SPECT';
		case 'stress-cardiac-mri':
			return 'Stress cardiac MRI';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'suspected-angina':
			return 'Suspected angina';
		case 'known-cad-assessment':
			return 'Known CAD assessment';
		case 'risk-stratification-post-mi':
			return 'Risk stratification post-MI';
		case 'pre-operative-cardiac':
			return 'Pre-operative cardiac';
		case 'exercise-tolerance':
			return 'Exercise tolerance';
		case 'arrhythmia-evaluation':
			return 'Arrhythmia evaluation';
		case 'valve-disease':
			return 'Valve disease';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable clinician-role label. */
export function clinicianRoleLabel(value: ClinicianRole | string): string {
	switch (value) {
		case 'cardiologist':
			return 'Cardiologist';
		case 'gp':
			return 'GP';
		case 'hospital-doctor':
			return 'Hospital doctor';
		case 'cardiac-physiologist':
			return 'Cardiac physiologist';
		case 'nurse':
			return 'Nurse';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable aortic-stenosis-severity label. */
export function aorticStenosisLabel(value: AorticStenosis | string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe (symptomatic)';
		case 'unknown':
			return 'Unknown';
		default:
			return 'Not specified';
	}
}

/** Human-readable care-setting label. */
export function settingLabel(value: Setting | string): string {
	switch (value) {
		case 'outpatient':
			return 'Outpatient';
		case 'inpatient':
			return 'Inpatient';
		case 'community':
			return 'Community';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B contraindication display label. */
export function contraindicationLabel(value: ContraindicationBand | string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not graded';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B contraindication badge colour. */
export function contraindicationColor(value: ContraindicationBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-info text-info-content border-info';
		case 'redirect':
			return 'bg-warning text-warning-content border-warning';
		case 'reject':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Appropriateness 1-9 score badge colour (mirrors the band thresholds). */
export function appropriatenessScoreColor(score: number): string {
	if (score >= 7) return 'bg-success text-success-content border-success';
	if (score >= 4) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
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
