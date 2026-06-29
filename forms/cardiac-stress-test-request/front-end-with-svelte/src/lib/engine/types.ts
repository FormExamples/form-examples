// ──────────────────────────────────────────────
// Cardiac Stress Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is grouped into the
// same sections the single-page wizard presents.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints / HTML option sets) ───

/** Requested stress-test modality. */
export type TestType =
	| 'exercise-treadmill-ecg'
	| 'stress-echo'
	| 'dobutamine-stress-echo'
	| 'myocardial-perfusion-spect'
	| 'stress-cardiac-mri'
	| 'other'
	| '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'suspected-angina'
	| 'known-cad-assessment'
	| 'risk-stratification-post-mi'
	| 'pre-operative-cardiac'
	| 'exercise-tolerance'
	| 'arrhythmia-evaluation'
	| 'valve-disease'
	| 'other'
	| '';

/** Requesting clinician's role. */
export type ClinicianRole =
	| 'cardiologist'
	| 'gp'
	| 'hospital-doctor'
	| 'cardiac-physiologist'
	| 'nurse'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'NMC' | 'HCPC' | 'other' | '';

/** Aortic-stenosis severity from the safety screen. */
export type AorticStenosis = 'none' | 'mild' | 'moderate' | 'severe' | 'unknown' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (ACC/AHA Appropriate Use Criteria). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — safety / contraindication band. */
export type ContraindicationBand = 'ok' | 'caution' | 'contraindicated' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record sections ───

/** Requesting clinician section. */
export interface Clinician {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	registrationBody: RegistrationBody;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient identification section. */
export interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
}

/** Requested examination section. */
export interface RequestDetails {
	testType: TestType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Symptoms and exercise-capacity section. */
export interface Symptoms {
	symptomChestPain: boolean;
	symptomBreathlessness: boolean;
	symptomPalpitations: boolean;
	ableToExercise: boolean;
	restingEcgFindings: string;
}

/** Cardiac safety-screen section. */
export interface Safety {
	knownCoronaryArteryDisease: boolean;
	recentAcuteCoronarySyndrome: boolean;
	aorticStenosis: AorticStenosis;
	uncontrolledHypertension: boolean;
	betaBlocker: boolean;
}

/** Triage section. */
export interface Triage {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The cardiac stress test request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface StressTestRequest {
	clinician: Clinician;
	patient: Patient;
	request: RequestDetails;
	symptoms: Symptoms;
	safety: Safety;
	triage: Triage;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'recent-acs-contraindication'
	| 'severe-aortic-stenosis'
	| 'uncontrolled-hypertension'
	| 'unable-to-exercise'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: Axis;
	category: string;
	description: string;
}

/** A safety-critical flag, independent of the four axes. */
export interface Flag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/**
 * The computed four-axis vetting grade. Mirrors the form's grade table.
 */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	contraindicationBand: ContraindicationBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
	// Overall
	recommendation: Recommendation;
	recommendationLabel: string;
	firedRules: FiredRule[];
	flags: Flag[];
	gradedAt: string;
}

// ─── Step configuration ───

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

// ─── Dashboard row ───

/** A graded request row for the vetting dashboard table. */
export interface RequestRow {
	id: string;
	patientName: string;
	testType: TestType;
	primaryIndication: Indication;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	contraindicationBand: ContraindicationBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
