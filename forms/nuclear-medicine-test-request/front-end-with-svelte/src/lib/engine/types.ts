// ──────────────────────────────────────────────
// Nuclear Medicine Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The model is nested by wizard section
// (clinician / patient / request / safety / justification / triage) so step
// components bind to a live section reference.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the form option catalogues) ───

/** Requesting-clinician role. */
export type ClinicianRole =
	| 'radiologist'
	| 'nuclear-medicine-physician'
	| 'oncologist'
	| 'cardiologist'
	| 'gp'
	| 'technologist'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'HCPC' | 'NMC' | 'other' | '';

/** Requested radionuclide scan type. */
export type ScanType =
	| 'bone-scan'
	| 'myocardial-perfusion'
	| 'vq-lung-scan'
	| 'thyroid-uptake'
	| 'renal-dmsa'
	| 'renal-mag3'
	| 'gallium-octreotide'
	| 'white-cell-scan'
	| 'sentinel-node'
	| 'other'
	| '';

/** Primary clinical indication. */
export type Indication =
	| 'suspected-bone-metastases'
	| 'cardiac-ischaemia'
	| 'pulmonary-embolism'
	| 'thyroid-function'
	| 'renal-function'
	| 'infection-localisation'
	| 'tumour-localisation'
	| 'sentinel-node-mapping'
	| 'other'
	| '';

/** Pregnancy status for radiation justification. */
export type PregnancyStatus =
	| 'not-pregnant'
	| 'pregnant'
	| 'possible'
	| 'unknown'
	| 'not-applicable'
	| '';

/** Care setting the referral originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — ACR / RCR iRefer appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — preparation & radiation-safety band. */
export type PrepSafetyBand = 'ok' | 'caution' | 'contraindicated' | '';

/** Axis B — radiation effective-dose band. */
export type RadiationDoseBand = 'low' | 'moderate' | 'high' | '';

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
}

/** Requested examination (step 3). */
export interface RequestSection {
	scanType: ScanType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Radiation safety (step 4). */
export interface SafetySection {
	pregnancyStatus: PregnancyStatus;
	breastfeeding: boolean;
	egfr: number | null;
	recentOtherNuclearScan: boolean;
}

/** IR(ME)R justification (step 5). */
export interface JustificationSection {
	irMeRJustification: string;
	supervisingConsultant: string;
}

/** Triage and submit (steps 6-7). */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The nuclear medicine request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface NuclearMedicineRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	safety: SafetySection;
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
	| 'high-radiation-dose'
	| 'recent-radionuclide-interference'
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
	prepSafetyBand: PrepSafetyBand;
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
	scanType: ScanType;
	primaryIndication: Indication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	prepSafetyBand: PrepSafetyBand;
	radiationDoseBand: RadiationDoseBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
