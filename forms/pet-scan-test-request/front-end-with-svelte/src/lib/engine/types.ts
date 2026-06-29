// ──────────────────────────────────────────────
// PET Scan Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request is a nested record whose
// sections map one-to-one onto the wizard steps.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested PET tracer / scan type. */
export type ScanType =
	| 'fdg-pet-ct'
	| 'psma-pet'
	| 'dotatate-pet'
	| 'amyloid-pet'
	| 'cardiac-pet'
	| 'other'
	| '';

/** Primary clinical indication for the study. */
export type Indication =
	| 'cancer-staging'
	| 'cancer-restaging'
	| 'treatment-response'
	| 'suspected-recurrence'
	| 'solitary-pulmonary-nodule'
	| 'lymphoma'
	| 'cardiac-viability'
	| 'infection-inflammation'
	| 'neurology-dementia'
	| 'other'
	| '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Pregnancy status at the time of request. */
export type PregnancyStatus =
	| 'not-pregnant'
	| 'pregnant'
	| 'possible'
	| 'unknown'
	| 'not-applicable'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (ACR / RCR iRefer). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — preparation-safety band (EANM / SNMMI + IR(ME)R). */
export type PrepSafetyBand = 'ok' | 'caution' | 'contraindicated' | '';

/** Axis B — relative radiation-dose band. */
export type RadiationDoseBand = 'low' | 'moderate' | 'high' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard step) ───

/** Requesting clinician (step 1). */
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

/** Patient identification (step 2). */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	weightKg: number | null;
	setting: Setting;
	interpreterRequired: boolean;
}

/** Requested examination (step 3). */
export interface RequestSection {
	scanType: ScanType;
	primaryIndication: Indication;
	clinicalQuestion: string;
}

/** Clinical context (step 4). */
export interface ContextSection {
	primaryTumourSite: string;
	relevantHistory: string;
	recentChemoRadiotherapy: string;
}

/** Preparation and safety (step 5). */
export interface PreparationSection {
	diabetes: boolean;
	bloodGlucoseMmolL: number | null;
	pregnancyStatus: PregnancyStatus;
	breastfeeding: boolean;
	egfr: number | null;
	claustrophobia: boolean;
}

/** Radiation justification (step 6). */
export interface JustificationSection {
	irMeRJustification: string;
	urgency: Urgency;
}

/** Triage and submission (step 7). */
export interface TriageSection {
	requestedByDate: string;
	notes: string;
}

/**
 * The PET-CT scan request — the source-of-truth record the four-axis vetting
 * grade is computed from.
 */
export interface PetScanRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	context: ContextSection;
	preparation: PreparationSection;
	justification: JustificationSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'pregnancy'
	| 'breastfeeding'
	| 'uncontrolled-glucose'
	| 'high-radiation-dose'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'missing-glucose'
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
	prepSafetyBand: PrepSafetyBand;
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
export interface DashboardRow {
	id: string;
	patientName: string;
	scanType: ScanType;
	primaryIndication: Indication;
	urgency: Urgency;
	appropriatenessBand: AppropriatenessBand;
	prepSafetyBand: PrepSafetyBand;
	radiationDoseBand: RadiationDoseBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
