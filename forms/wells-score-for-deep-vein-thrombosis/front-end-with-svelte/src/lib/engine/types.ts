// ──────────────────────────────────────────────
// Core assessment data types (Wells DVT)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_wells_score_for_deep_vein_thrombosis.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'doctor'
	| 'nurse-practitioner'
	| 'physician-associate'
	| 'other'
	| '';
export type CareSetting =
	| 'emergency-department'
	| 'ambulatory'
	| 'acute-medical-unit'
	| 'dvt-clinic'
	| 'other'
	| '';
export type AgeBand = '18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type SymptomaticLeg = 'left' | 'right' | '';
export type YesNo = 'yes' | 'no' | '';
export type TwoLevelBand = 'likely' | 'unlikely';
export type ThreeLevelBand = 'low' | 'moderate' | 'high';
export type RecommendedInvestigation = 'proximal-leg-vein-ultrasound' | 'd-dimer';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	symptomaticLeg: SymptomaticLeg;
}

/** Step 3 — predisposing factors (criteria 1, 2, 3, 9). */
export interface Predisposing {
	/** Criterion 1 (+1). */
	activeCancer: YesNo;
	/** Criterion 2 (+1). */
	paralysisOrImmobilisation: YesNo;
	/** Criterion 3 (+1). */
	recentlyBedriddenOrSurgery: YesNo;
	/** Criterion 9 (+1). */
	previouslyDocumentedDvt: YesNo;
}

/** Step 4 — leg examination (criteria 4–8). */
export interface Examination {
	/** Criterion 4 (+1). */
	localisedTenderness: YesNo;
	/** Criterion 5 (+1). */
	entireLegSwollen: YesNo;
	/** Criterion 6 (+1). */
	calfSwellingOver3cm: YesNo;
	/** Criterion 7 (+1). */
	pittingOedema: YesNo;
	/** Criterion 8 (+1). */
	collateralSuperficialVeins: YesNo;
}

/** Step 5 — alternative diagnosis (−2 adjustment). */
export interface Alternative {
	/** Alternative diagnosis at least as likely as DVT (−2). */
	alternativeDiagnosisAsLikely: YesNo;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNotes: string;
}

/** The full Wells DVT assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	predisposing: Predisposing;
	examination: Examination;
	alternative: Alternative;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-ACTIVE-CANCER-01. */
	id: string;
	/** Criterion slug, or a band audit row. */
	criterion: string;
	/** Points contributed (+1, −2, or 0 for audit rows). */
	points: number;
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

/** A Wells DVT grading rule. */
export interface WellsRule {
	id: string;
	/** Criterion slug. */
	criterion: string;
	/** Points contributed when the rule fires (+1 or −2). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	criterionPoints: Record<string, number>;
	/** Total Wells score, range −2..9. */
	wellsScore: number;
	twoLevelBand: TwoLevelBand;
	threeLevelBand: ThreeLevelBand;
	recommendedInvestigation: RecommendedInvestigation;
	firedCriteria: FiredCriterion[];
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
