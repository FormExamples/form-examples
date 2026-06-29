// ──────────────────────────────────────────────
// Nerve Conduction Study Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The model is nested by wizard section
// (clinician, patient, study, request, symptoms, safety, triage).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested electrodiagnostic study type. */
export type StudyType =
	| 'nerve-conduction'
	| 'emg'
	| 'nerve-conduction-and-emg'
	| 'repetitive-stimulation'
	| 'other'
	| '';

/** Anatomical region of interest. */
export type Region =
	| 'upper-limb'
	| 'lower-limb'
	| 'all-limbs'
	| 'cranial'
	| 'generalised'
	| 'other'
	| '';

/** Laterality of the requested study. */
export type Laterality = 'left' | 'right' | 'bilateral' | 'not-applicable' | '';

/** Primary clinical indication. */
export type Indication =
	| 'carpal-tunnel'
	| 'peripheral-neuropathy'
	| 'radiculopathy'
	| 'suspected-motor-neurone-disease'
	| 'myopathy'
	| 'plexopathy'
	| 'suspected-myasthenia'
	| 'nerve-injury'
	| 'other'
	| '';

/** Symptom duration band. */
export type SymptomDuration =
	| 'less-than-6-weeks'
	| '6-weeks-to-3-months'
	| '3-to-12-months'
	| 'over-12-months'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (AANEM / AAN 1–9 → band). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — procedural-risk band. */
export type ProceduralRiskBand = 'low' | 'moderate' | 'high' | '';

/** Axis D — triage tier. */
export type TriageTier = 'routine' | 'urgent' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

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
	interpreterRequired: boolean;
}

/** Requested-study section. */
export interface StudySection {
	studyType: StudyType;
	region: Region;
	laterality: Laterality;
	requestedByDate: string;
}

/** Indication and clinical-question section. */
export interface RequestSection {
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Symptoms section. */
export interface SymptomsSection {
	symptomNumbness: boolean;
	symptomWeakness: boolean;
	symptomPain: boolean;
	symptomTingling: boolean;
	symptomDuration: SymptomDuration;
}

/** Safety section (drives the procedural-risk axis). */
export interface SafetySection {
	diabetes: boolean;
	takingAnticoagulant: boolean;
	pacemakerOrIcd: boolean;
}

/** Triage section. */
export interface TriageSection {
	urgency: Urgency;
	setting: Setting;
	notes: string;
}

/**
 * The nerve conduction study / EMG (electrodiagnostic) request — the
 * source-of-truth record the four-axis vetting grade is computed from.
 */
export interface NerveConductionStudyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	study: StudySection;
	request: RequestSection;
	symptoms: SymptomsSection;
	safety: SafetySection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'risk' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade-flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-mnd-urgent'
	| 'anticoag-emg-bleeding-risk'
	| 'pacemaker-stimulation-caution'
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

/** The computed four-axis vetting grade. */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	proceduralRiskBand: ProceduralRiskBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
	// Overall
	recommendation: Recommendation;
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
	studyType: StudyType;
	region: Region;
	indication: Indication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	proceduralRiskBand: ProceduralRiskBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
