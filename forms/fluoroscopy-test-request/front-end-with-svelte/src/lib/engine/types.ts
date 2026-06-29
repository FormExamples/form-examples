// ──────────────────────────────────────────────
// Fluoroscopy Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations. The request data model is nested by
// section (clinician, patient, request, safety, triage) to match the source
// engine and the SQL entity layout.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requesting clinician role. */
export type ClinicianRole =
	| 'radiologist'
	| 'gp'
	| 'hospital-doctor'
	| 'surgeon'
	| 'gastroenterologist'
	| 'radiographer'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'HCPC' | 'NMC' | 'other' | '';

/** Requested fluoroscopy / contrast study type. */
export type StudyType =
	| 'barium-swallow'
	| 'barium-meal'
	| 'barium-follow-through'
	| 'barium-enema'
	| 'water-soluble-contrast-swallow'
	| 'defecating-proctogram'
	| 'hysterosalpingogram'
	| 'micturating-cystourethrogram'
	| 'arthrogram'
	| 'fluoroscopy-guided-procedure'
	| 'other'
	| '';

/** Primary clinical indication for the study. */
export type Indication =
	| 'dysphagia'
	| 'reflux'
	| 'suspected-obstruction'
	| 'suspected-perforation'
	| 'constipation'
	| 'infertility-tubal-patency'
	| 'vesicoureteric-reflux'
	| 'joint-assessment'
	| 'other'
	| '';

/** Pregnancy status. */
export type PregnancyStatus =
	| 'not-pregnant'
	| 'pregnant'
	| 'possible'
	| 'unknown'
	| 'not-applicable'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (ACR / RCR iRefer 1–9 ordinal). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — safety band. */
export type SafetyBand = 'ok' | 'caution' | 'contraindicated' | '';

/** Axis B — radiation-dose band. */
export type RadiationDoseBand = 'low' | 'moderate' | 'high' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by section) ───

/** Requesting-clinician section. */
export interface ClinicianSection {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	registrationBody: RegistrationBody;
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
	bodyMassIndex: number | null;
}

/** Requested-examination section. */
export interface RequestSection {
	studyType: StudyType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Safety & radiation section. */
export interface SafetySection {
	pregnancyStatus: PregnancyStatus;
	contrastAllergy: boolean;
	aspirationRisk: boolean;
	diabetes: boolean;
	irMeRJustification: string;
}

/** Triage & submit section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The fluoroscopy / contrast-study request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface FluoroscopyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	safety: SafetySection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'pregnancy'
	| 'contrast-allergy'
	| 'aspiration-risk'
	| 'suspected-perforation-contrast-choice'
	| 'high-radiation-dose'
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
 * The computed four-axis vetting grade. Mirrors the SQL grade table.
 */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	safetyBand: SafetyBand;
	radiationDoseBand: RadiationDoseBand;
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
	primaryIndication: Indication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	safetyBand: SafetyBand;
	radiationDoseBand: RadiationDoseBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
