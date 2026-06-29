// ──────────────────────────────────────────────
// DEXA Bone Density Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is nested by section,
// matching the source-of-truth JS engine (front-end-form-with-html/js/types.js).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the form options / SQL CHECK constraints) ───

/** Requested DEXA scan region. */
export type ScanRegion =
	| 'hip'
	| 'spine'
	| 'hip-and-spine'
	| 'forearm'
	| 'whole-body'
	| 'other'
	| '';

/** Primary clinical indication for the scan. */
export type Indication =
	| 'osteoporosis-screening'
	| 'fragility-fracture'
	| 'long-term-steroids'
	| 'early-menopause'
	| 'high-frax-risk'
	| 'monitoring-treatment'
	| 'secondary-osteoporosis'
	| 'other'
	| '';

/** Requesting clinician role. */
export type ClinicianRole =
	| 'radiologist'
	| 'gp'
	| 'rheumatologist'
	| 'endocrinologist'
	| 'hospital-doctor'
	| 'radiographer'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'HCPC' | 'NMC' | 'other' | '';

/** Pregnancy status (drives the radiation-safety axis). */
export type PregnancyStatus = 'not-pregnant' | 'possible' | 'pregnant' | 'not-applicable' | '';

/** Menopause status. */
export type MenopauseStatus = 'pre' | 'peri' | 'post' | 'not-applicable' | '';

/** Previous DEXA result. */
export type PreviousDexaResult = 'none' | 'normal' | 'osteopenia' | 'osteoporosis' | 'unknown' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — radiation dose band. */
export type RadiationDoseBand = 'low' | 'moderate' | 'high' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

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
	pregnancyStatus: PregnancyStatus;
}

/** Requested examination section. */
export interface RequestSection {
	scanRegion: ScanRegion;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Fracture-risk factors section (FRAX inputs). */
export interface RiskFactorsSection {
	fraxMajorFracturePercent: number | null;
	previousFragilityFracture: boolean;
	longTermSteroids: boolean;
	menopauseStatus: MenopauseStatus;
	parentalHipFracture: boolean;
	weightKg: number | null;
}

/** Previous DEXA section. */
export interface PreviousDexaSection {
	previousDexa: PreviousDexaResult;
	previousDexaDate: string;
}

/** Triage and submission section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The DEXA bone-density request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface DexaRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	riskFactors: RiskFactorsSection;
	previousDexa: PreviousDexaSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'recent-fragility-fracture'
	| 'high-frax-risk'
	| 'duplicate-recent-dexa'
	| 'pregnancy'
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
 * The computed four-axis vetting grade.
 */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	radiationDoseBand: RadiationDoseBand;
	safetyNote: string;
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
	scanRegion: ScanRegion;
	primaryIndication: Indication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	appropriatenessScore: number;
	radiationDoseBand: RadiationDoseBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
