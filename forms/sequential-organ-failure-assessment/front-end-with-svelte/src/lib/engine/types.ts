// ──────────────────────────────────────────────
// Core assessment data types (SOFA)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_sequential_organ_failure_assessment.sql`.
// ──────────────────────────────────────────────

export type AssessorRole =
	| 'intensivist'
	| 'critical-care-physician'
	| 'acute-physician'
	| 'resident'
	| 'nurse'
	| 'outreach-practitioner'
	| 'other'
	| '';
export type CareLocation =
	| 'icu'
	| 'hdu'
	| 'critical-care-outreach'
	| 'acute-medical-unit'
	| 'emergency-department'
	| 'other'
	| '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type SuspectedInfection = 'yes' | 'no' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RespiratorySupport = 'ventilated' | 'cpap' | 'none' | '';
export type Vasopressor =
	| 'none'
	| 'dopamine'
	| 'dobutamine'
	| 'adrenaline'
	| 'noradrenaline'
	| 'other'
	| '';
export type MortalityBand = 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';
export type Priority = 'high' | 'medium' | 'low';

/** A per-organ-system sub-score: an ordinal 0-4 band, or `null` when not scored. */
export type SubScore = 0 | 1 | 2 | 3 | 4 | null;

/** The six SOFA organ systems, in scoring order. */
export type OrganSystem =
	| 'respiration'
	| 'coagulation'
	| 'liver'
	| 'cardiovascular'
	| 'cns'
	| 'renal';

/** Step 1 — clinician and context. */
export interface Context {
	assessorName: string;
	assessorRole: AssessorRole;
	assessorRegistrationNumber: string;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careLocation: CareLocation;
	hoursSinceAdmission: number | null;
}

/** Step 2 — patient identification and baseline. */
export interface Baseline {
	patientIdentifier: string;
	ageYears: number | null;
	sex: Sex;
	admissionDiagnosis: string;
	suspectedInfection: SuspectedInfection;
	baselineSofaTotal: number | null;
}

/** Step 3 — respiration (PaO2/FiO2 ratio, respiratory support). */
export interface Respiration {
	/** arterial PaO2 (mmHg for the P/F ratio). */
	pao2: number | null;
	/** fraction of inspired oxygen, decimal 0.21-1.0. */
	fio2: number | null;
	/** directly-entered PaO2/FiO2 ratio (mmHg). */
	pao2Fio2Ratio: number | null;
	respiratorySupport: RespiratorySupport;
}

/** Step 4 — coagulation (platelet count, x10^9/L). */
export interface Coagulation {
	platelets: number | null;
}

/** Step 5 — liver (bilirubin, umol/L). */
export interface Liver {
	bilirubin: number | null;
}

/** Step 6 — cardiovascular (MAP, vasopressor agent and dose). */
export interface Cardiovascular {
	/** mean arterial pressure, mmHg. */
	map: number | null;
	vasopressor: Vasopressor;
	/** ug/kg/min. */
	vasopressorDose: number | null;
}

/** Step 7 — central nervous system (Glasgow Coma Scale, sedation). */
export interface Cns {
	/** GCS total 3-15. */
	glasgowComaScale: number | null;
	/** use pre-sedation GCS or best estimate when sedated. */
	sedated: YesNo;
}

/** Step 8 — renal (creatinine umol/L, 24-hour urine output mL/day). */
export interface Renal {
	creatinine: number | null;
	urineOutput: number | null;
}

/** Step 9 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full SOFA assessment data model. */
export interface AssessmentData {
	context: Context;
	baseline: Baseline;
	respiration: Respiration;
	coagulation: Coagulation;
	liver: Liver;
	cardiovascular: Cardiovascular;
	cns: Cns;
	renal: Renal;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** The six per-system sub-scores. */
export interface SubScores {
	respiration: SubScore;
	coagulation: SubScore;
	liver: SubScore;
	cardiovascular: SubScore;
	cns: SubScore;
	renal: SubScore;
}

/** The result of scoring a single organ system. */
export interface SystemScore {
	score: SubScore;
	ruleId: string;
	category: string;
	description: string;
}

/** A single scored/derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-RESPIRATION-3. */
	id: string;
	/** respiration | coagulation | liver | cardiovascular | cns | renal | total | delta | band | sepsis */
	parameter: string;
	/** The 0-4 sub-score this rule contributed (null for derivations). */
	points: number | null;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	subScores: SubScores;
	/** sum of the non-null sub-scores, 0..24. */
	totalSofa: number;
	/** true when all six sub-scores are non-null. */
	complete: boolean;
	/** totalSofa - baselineSofaTotal, or null when no baseline. */
	deltaSofa: number | null;
	mortalityBand: MortalityBand;
	sepsis3: boolean;
	firedRules: FiredRule[];
	flaggedIssues: FlaggedIssue[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AssessmentData;
}
