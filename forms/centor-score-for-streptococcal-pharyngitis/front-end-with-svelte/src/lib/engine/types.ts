// ──────────────────────────────────────────────
// Core assessment data types (Centor / McIsaac)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_centor_score_for_streptococcal_pharyngitis.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'gp' | 'nurse-practitioner' | 'pharmacist' | 'other' | '';
export type CareSetting =
	| 'general-practice'
	| 'urgent-care'
	| 'pharmacy'
	| 'emergency-department'
	| 'other'
	| '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'moderate' | 'high';
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
	/** Whole years; drives the McIsaac age modifier. */
	ageYears: number | null;
	sex: Sex;
}

/** Step 3 — Centor criterion 1: tonsillar exudate or swelling. */
export interface Exudate {
	tonsillarExudate: YesNo;
}

/** Step 4 — Centor criterion 2: tender anterior cervical lymphadenopathy. */
export interface Nodes {
	tenderAnteriorCervicalNodes: YesNo;
}

/** Step 5 — Centor criterion 3: fever (> 38 °C or history of fever). */
export interface Fever {
	/** History of fever / > 38 °C. */
	feverOver38: YesNo;
	/** Optional measured temperature; > 38.0 sets fever. */
	measuredTemperatureCelsius: number | null;
}

/** Step 6 — Centor criterion 4: absence of cough (scores when cough is absent). */
export interface Cough {
	absenceOfCough: YesNo;
}

/** Step 7 — airway / peritonsillar (quinsy) red-flag inputs. */
export interface RedFlags {
	stridorOrBreathingDifficulty: YesNo;
	droolingOrCannotSwallow: YesNo;
	trismus: YesNo;
	muffledVoice: YesNo;
	unilateralNeckSwelling: YesNo;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Centor / McIsaac assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	exudate: Exudate;
	nodes: Nodes;
	fever: Fever;
	cough: Cough;
	redFlags: RedFlags;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-TONSILLAR-EXUDATE-01. */
	id: string;
	/** tonsillar-exudate | tender-nodes | fever | cough-absent | age-modifier | band */
	criterion: string;
	/** Points contributed. */
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

/** A Centor grading rule. */
export interface CentorRule {
	id: string;
	/** tonsillar-exudate | tender-nodes | fever | cough-absent */
	criterion: string;
	/** Points contributed when the rule fires (1). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	tonsillarExudatePoint: 0 | 1;
	tenderNodesPoint: 0 | 1;
	feverPoint: 0 | 1;
	coughAbsentPoint: 0 | 1;
	centorScore: 0 | 1 | 2 | 3 | 4;
	ageModifier: -1 | 0 | 1;
	/** Modified McIsaac score, -1..5. */
	mcIsaacScore: number;
	riskBand: RiskBand;
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
