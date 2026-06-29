// ──────────────────────────────────────────────
// Coagulation Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request data model is nested by
// section (clinician, patient, tests, clinical, specimen, triage) so step
// components can capture a stable section reference (e.g.
// `const c = request.data.clinical`).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Primary clinical indication for the coagulation request. */
export type PrimaryIndication =
	| 'anticoagulation-monitoring'
	| 'bleeding-disorder'
	| 'suspected-dvt-pe'
	| 'pre-operative'
	| 'thrombophilia-investigation'
	| 'liver-disease'
	| 'disseminated-intravascular-coagulation'
	| 'abnormal-bleeding'
	| 'other'
	| '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Whether a specimen has been collected. */
export type SpecimenCollected = 'yes' | 'no' | '';

/** Sodium-citrate tube fill state. */
export type CitrateTubeFill = 'adequate' | 'underfilled' | 'overfilled' | '';

/** Whether the 9:1 blood-to-citrate ratio is correct. */
export type CitrateRatioCorrect = 'yes' | 'no' | 'unknown' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'stat' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — pre-analytical / specimen-safety band. */
export type PreanalyticalBand = 'ok' | 'caution' | 'reject-risk' | '';

/** Axis D — triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'stat' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by section) ───

/** Requesting-clinician section. */
export interface ClinicianSection {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient-identification section. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
}

/** The nine orderable coagulation-test booleans. */
export interface TestsSection {
	prothrombinTimeInr: boolean;
	activatedPartialThromboplastinTime: boolean;
	fibrinogen: boolean;
	dDimer: boolean;
	thrombophiliaScreen: boolean;
	factorAssays: boolean;
	antiXaAssay: boolean;
	mixingStudies: boolean;
	vonWillebrandScreen: boolean;
}

/** The camelCase field key of an orderable coagulation test. */
export type TestField = keyof TestsSection;

/** Clinical-context section. */
export interface ClinicalSection {
	primaryIndication: PrimaryIndication;
	clinicalDetails: string;
	onAnticoagulant: boolean;
	anticoagulantAgent: string;
	bleedingHistory: boolean;
	thrombosisHistory: boolean;
	activeBleeding: boolean;
	suspectedDic: boolean;
	wellsUnlikely: boolean;
}

/** Specimen / pre-analytical section. */
export interface SpecimenSection {
	specimenCollected: SpecimenCollected;
	collectionDatetime: string;
	citrateTubeFill: CitrateTubeFill;
	citrateRatioCorrect: CitrateRatioCorrect;
}

/** Triage section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	siteName: string;
	setting: Setting;
	notes: string;
}

/**
 * The coagulation / haemostasis test request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface CoagulationTestRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	tests: TestsSection;
	clinical: ClinicalSection;
	specimen: SpecimenSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'preanalytical' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'active-bleeding-stat'
	| 'suspected-dic'
	| 'd-dimer-low-pretest-caution'
	| 'specimen-underfilled-risk'
	| 'missing-clinical-details'
	| 'no-test-selected'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: string;
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

/** The computed four-axis vetting grade. */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	preanalyticalBand: PreanalyticalBand;
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
	primaryIndication: PrimaryIndication;
	testCount: number;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	preanalyticalBand: PreanalyticalBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
