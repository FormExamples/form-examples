// ──────────────────────────────────────────────
// MRI Scan Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The model is nested by wizard section
// (clinician / patient / request / contrast / safety / priorImaging /
// logistics / triage) so step components bind to a live section reference.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the form option catalogues) ───

/** Requesting-clinician role. */
export type ClinicianRole =
	| 'radiologist'
	| 'gp'
	| 'hospital-doctor'
	| 'neurologist'
	| 'orthopaedic-surgeon'
	| 'oncologist'
	| 'radiographer'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'HCPC' | 'NMC' | 'other' | '';

/** Requested MRI body region. */
export type BodyRegion =
	| 'brain'
	| 'spine-cervical'
	| 'spine-thoracic'
	| 'spine-lumbar'
	| 'head-neck'
	| 'chest'
	| 'abdomen'
	| 'pelvis'
	| 'cardiac'
	| 'mr-angiogram'
	| 'breast'
	| 'musculoskeletal-joint'
	| 'whole-body'
	| 'other'
	| '';

/** Primary clinical indication. */
export type Indication =
	| 'suspected-malignancy'
	| 'cancer-staging'
	| 'neurological-deficit'
	| 'suspected-ms'
	| 'back-pain-radiculopathy'
	| 'joint-derangement'
	| 'suspected-stroke'
	| 'epilepsy'
	| 'dementia'
	| 'pituitary'
	| 'cardiac-function'
	| 'follow-up-surveillance'
	| 'other'
	| '';

/** Whether IV contrast is requested. */
export type ContrastRequired = 'none' | 'iv-gadolinium' | 'unknown' | '';

/** Severity of any previous gadolinium contrast reaction. */
export type GadoliniumReaction = 'none' | 'mild' | 'moderate' | 'severe' | 'unknown' | '';

/** Pregnancy status for contrast / scanning decisions. */
export type PregnancyStatus =
	| 'not-pregnant'
	| 'pregnant'
	| 'possible'
	| 'unknown'
	| 'not-applicable'
	| '';

/** The referrer's preliminary MRI safety status. */
export type MriSafetyStatus = 'cleared' | 'conditional' | 'needs-review' | 'unsafe' | '';

/** Care setting the referral originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Patient weight versus the scanner's bore / table limit. */
export type BoreLimit = 'within-limit' | 'borderline' | 'exceeds-limit' | 'unknown' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — ACR appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — MRI safety band. */
export type MriSafetyBand =
	| 'cleared'
	| 'conditional'
	| 'needs-mri-physics-review'
	| 'contraindicated'
	| '';

/** Axis B (contrast) — gadolinium-vs-eGFR renal flag. */
export type ContrastRenalFlag = 'none' | 'caution' | 'contraindicated' | 'unknown' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician (step 1). */
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

/** Patient identification (step 2). */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	weightKg: number | null;
	interpreterRequired: boolean;
}

/** Requested examination (step 3). */
export interface RequestSection {
	bodyRegion: BodyRegion;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Contrast and renal risk (step 4). */
export interface ContrastSection {
	contrastRequired: ContrastRequired;
	egfr: number | null;
	previousGadoliniumReaction: GadoliniumReaction;
	pregnancyStatus: PregnancyStatus;
}

/** MRI safety screen — ferromagnetic / electronic implant checklist (step 5). */
export interface SafetySection {
	pacemakerOrIcd: boolean;
	cochlearImplant: boolean;
	aneurysmClip: boolean;
	metallicForeignBodyEye: boolean;
	shrapnelOrMetalFragments: boolean;
	programmableShunt: boolean;
	neurostimulator: boolean;
	metalImplantOrProsthesis: boolean;
	insulinPump: boolean;
	claustrophobia: boolean;
	mriSafetyStatus: MriSafetyStatus;
}

/** Prior imaging (step 6). */
export interface PriorImagingSection {
	relevantPreviousImaging: string;
}

/** Logistics (step 7). */
export interface LogisticsSection {
	weightVersusBoreLimit: BoreLimit;
	setting: Setting;
	siteName: string;
}

/** Triage and submit (step 8). */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	notes: string;
}

/**
 * The MRI scan request — the source-of-truth record the four-axis vetting
 * grade is computed from.
 */
export interface MriRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	contrast: ContrastSection;
	safety: SafetySection;
	priorImaging: PriorImagingSection;
	logistics: LogisticsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'ferromagnetic-implant'
	| 'pacemaker-icd'
	| 'orbital-foreign-body'
	| 'gadolinium-renal-risk'
	| 'pregnancy'
	| 'claustrophobia'
	| 'missing-safety-screen'
	| 'missing-indication'
	| 'missing-clinical-question'
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
	mriSafetyBand: MriSafetyBand;
	contrastRenalFlag: ContrastRenalFlag;
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
	primaryIndication: Indication;
	mriSafetyStatus: MriSafetyStatus;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	mriSafetyBand: MriSafetyBand;
	contrastRenalFlag: ContrastRenalFlag;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
