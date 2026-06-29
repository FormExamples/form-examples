// ──────────────────────────────────────────────
// Ultrasound Test Request — core data types
//
// General (non-obstetric) diagnostic ultrasound request (referral). Field names
// are camelCase (front-end serde); they mirror the snake_case columns in the
// form's SQL migrations. The data model is nested by wizard section.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requesting clinician's role. */
export type ClinicianRole =
	| 'radiologist'
	| 'gp'
	| 'hospital-doctor'
	| 'surgeon'
	| 'sonographer'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'NMC' | 'HCPC' | 'other' | '';

/** Requested ultrasound body region. */
export type BodyRegion =
	| 'abdomen'
	| 'pelvis'
	| 'renal-tract'
	| 'liver-biliary'
	| 'thyroid-neck'
	| 'scrotum-testes'
	| 'breast'
	| 'soft-tissue'
	| 'vascular-doppler'
	| 'dvt-leg'
	| 'carotid'
	| 'msk-joint'
	| 'other'
	| '';

/** Laterality of the requested examination. */
export type Laterality = 'left' | 'right' | 'bilateral' | 'not-applicable' | '';

/** Primary clinical indication for the scan. */
export type Indication =
	| 'abdominal-pain'
	| 'suspected-gallstones'
	| 'abnormal-lfts'
	| 'renal-impairment'
	| 'haematuria'
	| 'palpable-mass'
	| 'suspected-dvt'
	| 'suspected-aaa'
	| 'thyroid-nodule'
	| 'testicular-pain'
	| 'follow-up'
	| 'other'
	| '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (ACR Appropriateness Criteria). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — preparation / technical suitability band. */
export type SuitabilityBand = 'ok' | 'caution' | 'limited' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by section) ───

/** Requesting clinician section. */
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

/** Patient identification section. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
	interpreterRequired: boolean;
}

/** Requested examination and clinical detail section. */
export interface RequestSection {
	bodyRegion: BodyRegion;
	laterality: Laterality;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
	previousScanFinding: string;
	previousScanDate: string;
}

/** Preparation section. */
export interface PrepSection {
	fastingRequired: boolean;
	fullBladderRequired: boolean;
}

/** Safety-critical red-flag section. */
export interface RedFlagsSection {
	suspectedDvt: boolean;
	suspectedTesticularTorsion: boolean;
	suspectedAaa: boolean;
}

/** Triage section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The general ultrasound request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface UltrasoundRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	prep: PrepSection;
	redFlags: RedFlagsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'suitability' | 'completeness' | 'triage';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-dvt-urgent'
	| 'suspected-testicular-torsion'
	| 'suspected-aaa'
	| 'prep-not-met'
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
	suitabilityBand: SuitabilityBand;
	prepRequirements: string;
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
	bodyRegion: BodyRegion;
	primaryIndication: Indication;
	urgency: Urgency;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	suitabilityBand: SuitabilityBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
