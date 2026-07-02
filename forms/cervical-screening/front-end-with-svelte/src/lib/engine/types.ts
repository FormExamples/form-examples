// ──────────────────────────────────────────────
// Core screening data types (Cervical Screening record)
//
// Cervical screening is a *classification* pathway, not a numeric-score form:
// the HPV-primary algorithm resolves a record to exactly one result class and
// one recommended management action via a gated, first-match cascade —
// eligibility first, then sample adequacy, then the primary hrHPV result
// refined by reflex cytology. It does not sum a total. camelCase property names
// mirror the snake_case SQL columns in `sql/04_create_table_cervical_screening.sql`.
// ──────────────────────────────────────────────

export type SampleTakerRole = 'practice-nurse' | 'gp' | 'smear-taker' | 'other' | '';
export type CareSetting = 'general-practice' | 'sexual-health' | 'other' | '';
export type RecallInterval = 'three-yearly' | 'five-yearly' | 'not-applicable' | '';
export type YesNo = 'yes' | 'no' | '';
export type SampleAdequacy = 'adequate' | 'inadequate' | '';
export type InadequateReason =
	| 'insufficient-cells'
	| 'obscuring-blood'
	| 'inflammation'
	| 'labelling'
	| 'other'
	| '';
export type HpvResult = 'negative' | 'positive' | 'not-tested' | '';
export type CytologyGrade =
	| 'negative'
	| 'borderline'
	| 'low-grade'
	| 'high-grade'
	| 'not-performed'
	| '';
export type Priority = 'high' | 'medium' | 'low';

export type ResultClass =
	| 'inadequate'
	| 'hpv-negative'
	| 'hpv-positive-cytology-normal'
	| 'hpv-positive-cytology-abnormal-low'
	| 'hpv-positive-cytology-abnormal-high'
	| 'hpv-positive-cytology-pending'
	| 'cease-not-eligible'
	| 'pending'
	| '';

export type ManagementAction =
	| 'routine-recall'
	| 'early-repeat-12-months'
	| 'colposcopy-referral'
	| 'urgent-colposcopy-referral'
	| 'repeat-sample-3-months'
	| 'cease-screening'
	| 'awaiting-cytology'
	| 'awaiting-result'
	| '';

export type Status = 'complete' | 'incomplete';

/** Step 1 — encounter context. */
export interface Context {
	sampleTakerName: string;
	sampleTakerRole: SampleTakerRole;
	careSetting: CareSetting;
	/** ISO-ish datetime-local string; '' when unset. */
	sampleTakenAt: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	nhsNumber: string;
	age: number | null;
	/** ISO date string; '' when unset. */
	dateOfBirth: string;
}

/** Step 3 — eligibility. */
export interface Eligibility {
	recallInterval: RecallInterval;
	/** date string; '' when unset. */
	screenDueDate: string;
	/** date string; '' when unset. */
	lastScreenDate: string;
	overdue: YesNo;
	previouslyCeased: YesNo;
}

/** Step 4 — consent. */
export interface Consent {
	consentGiven: YesNo;
}

/** Step 5 — symptoms. */
export interface Symptoms {
	symptomatic: YesNo;
	symptomDetail: string;
}

/** Step 6 — sample adequacy. */
export interface Adequacy {
	sampleAdequacy: SampleAdequacy;
	inadequateReason: InadequateReason;
}

/** Step 7 — primary hrHPV result. */
export interface Hpv {
	hpvResult: HpvResult;
}

/** Step 8 — reflex cytology (only when hpvResult == 'positive'). */
export interface Cytology {
	cytologyGrade: CytologyGrade;
}

/** Step 9 — clinician free-text note. */
export interface Note {
	clinicalContext: string;
}

/** The full cervical-screening data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	eligibility: Eligibility;
	consent: Consent;
	symptoms: Symptoms;
	adequacy: Adequacy;
	hpv: Hpv;
	cytology: Cytology;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single evaluated / fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-HPV-POSITIVE-CYTOLOGY-ABNORMAL-HIGH-01. */
	id: string;
	category: string;
	resultClass: ResultClass;
	managementAction: ManagementAction;
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

/** A cervical-screening classification rule (gated, first-match). */
export interface ClassificationRule {
	id: string;
	category: string;
	resultClass: ResultClass;
	managementAction: ManagementAction;
	description: string;
	/** true when this rule's gated condition matches. */
	evaluate: (data: AssessmentData) => boolean;
}

/** The full classification result for one screening record. */
export interface GradingResult {
	resultClass: ResultClass;
	managementAction: ManagementAction;
	status: Status;
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
