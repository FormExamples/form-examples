// ──────────────────────────────────────────────
// X-Ray Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request data model is nested by
// section (clinician / patient / request / detail / safety / practical /
// triage) to match the HTML source of truth.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Clinician role making the referral. */
export type ClinicianRole =
	| 'radiologist'
	| 'gp'
	| 'hospital-doctor'
	| 'surgeon'
	| 'emergency-physician'
	| 'radiographer'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'HCPC' | 'NMC' | 'other' | '';

/** Imaged body region. */
export type BodyRegion =
	| 'chest'
	| 'abdomen'
	| 'spine-cervical'
	| 'spine-thoracic'
	| 'spine-lumbar'
	| 'pelvis'
	| 'hip'
	| 'knee'
	| 'ankle-foot'
	| 'shoulder'
	| 'wrist-hand'
	| 'skull'
	| 'dental'
	| 'other'
	| '';

/** Laterality of the request. */
export type Laterality = 'left' | 'right' | 'bilateral' | 'not-applicable' | '';

/** Primary clinical indication. */
export type PrimaryIndication =
	| 'trauma-fracture'
	| 'chest-infection'
	| 'suspected-pneumothorax'
	| 'foreign-body'
	| 'joint-pain'
	| 'arthritis'
	| 'pre-operative'
	| 'line-position-check'
	| 'abdominal-obstruction'
	| 'swallowed-object'
	| 'follow-up'
	| 'other'
	| '';

/** Pregnancy status for the radiation-safety axis. */
export type PregnancyStatus =
	| 'not-applicable'
	| 'not-pregnant'
	| 'possible'
	| 'pregnant'
	| 'unknown'
	| '';

/** Patient mobility on arrival. */
export type Mobility = 'ambulant' | 'wheelchair' | 'trolley' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (ACR / RCR iRefer). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — radiation safety band (IR(ME)R 2017). */
export type RadiationSafetyBand = 'safe' | 'caution' | 'contraindicated' | '';

/** Axis B — relative effective-dose band. */
export type RadiationDoseBand = 'low' | 'moderate' | 'high' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record ───

/** Requesting clinician identification. */
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

/** Patient demographics. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
}

/** The requested examination (drives the appropriateness axis). */
export interface RequestSection {
	bodyRegion: BodyRegion;
	laterality: Laterality;
	primaryIndication: PrimaryIndication;
}

/** Clinical detail (the highest-value vetting fields). */
export interface DetailSection {
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Radiation safety fields. */
export interface SafetySection {
	pregnancyStatus: PregnancyStatus;
	recentSimilarXray: boolean;
	irMeRJustification: string;
}

/** Practical booking fields. */
export interface PracticalSection {
	mobility: Mobility;
	setting: Setting;
	requestedByDate: string;
}

/** Triage fields. */
export interface TriageSection {
	urgency: Urgency;
	notes: string;
}

/**
 * The plain-radiograph (X-ray) request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface XRayRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	detail: DetailSection;
	safety: SafetySection;
	practical: PracticalSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'pregnancy'
	| 'repeat-recent-imaging'
	| 'unjustified-exposure'
	| 'wrong-laterality-risk'
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
	radiationSafetyBand: RadiationSafetyBand;
	radiationDoseBand: RadiationDoseBand;
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
	bodyRegion: BodyRegion;
	primaryIndication: PrimaryIndication;
	appropriatenessBand: AppropriatenessBand;
	radiationSafetyBand: RadiationSafetyBand;
	radiationDoseBand: RadiationDoseBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
