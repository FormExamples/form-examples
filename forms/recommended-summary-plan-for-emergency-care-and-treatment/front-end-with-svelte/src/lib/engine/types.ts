// ──────────────────────────────────────────────
// Core data model (ReSPECT — Recommended Summary Plan for Emergency Care
// and Treatment).
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_respect.sql` (the short base name `respect` is used for
// the SQL table because the full slug would exceed PostgreSQL's 63-byte
// identifier limit).
//
// Unlike a scored assessment, ReSPECT is a documentation / completeness
// instrument: the engine grades a plan `complete` or `incomplete`, reports a
// completeness percentage, records which mandatory rules fired, and raises
// safety / governance flags. There is no numeric clinical score.
// ──────────────────────────────────────────────

export type PriorityBalance = 'sustain-life' | 'balanced' | 'comfort' | '';
export type CprRecommendation = 'attempt' | 'do-not-attempt' | '';
export type Ceiling = 'appropriate' | 'not-appropriate' | '';
export type Involvement = 'person' | 'legal-proxy' | 'consultees' | '';
export type ClinicianRole = 'doctor' | 'nurse' | 'paramedic' | 'other' | '';
export type YesNo = 'yes' | 'no' | '';
export type Status = 'complete' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — personal details. */
export interface Personal {
	personName: string;
	/** ISO date string; '' when unset. */
	dateOfBirth: string;
	identifier: string;
	address: string;
	keyContact: string;
}

/** Step 2 — summary of relevant health. */
export interface Health {
	healthSummary: string;
	diagnoses: string;
	existingDocuments: string;
}

/** Step 3 — preferences and what matters. */
export interface Preferences {
	whatMatters: string;
	carePreferences: string;
}

/** Step 4 — clinical recommendations. */
export interface Recommendations {
	priorityBalance: PriorityBalance;
	recommendedInterventions: string;
	notRecommendedInterventions: string;
}

/** Step 5 — CPR recommendation. */
export interface Cpr {
	cprRecommendation: CprRecommendation;
	cprRationale: string;
	cprDiscussed: YesNo;
}

/** Step 6 — ceilings of treatment. */
export interface Ceilings {
	hospitalTransfer: Ceiling;
	criticalCareAdmission: Ceiling;
	treatmentCeilings: string;
}

/** Step 7 — capacity and involvement. */
export interface Capacity {
	hasCapacity: YesNo;
	capacityAssessment: string;
	involvement: Involvement;
	proxyDetails: string;
}

/** Step 8 — clinician sign-off. */
export interface SignOff {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	clinicianRegistration: string;
	signature: string;
	/** ISO datetime string; '' when unsigned. */
	signedAt: string;
	seniorEndorsement: string;
	emergencyContacts: string;
	/** ISO date string; '' when unset. */
	reviewDate: string;
}

/** The full ReSPECT plan data model. */
export interface AssessmentData {
	personal: Personal;
	health: Health;
	preferences: Preferences;
	recommendations: Recommendations;
	cpr: Cpr;
	ceilings: Ceilings;
	capacity: Capacity;
	signOff: SignOff;
	/** Free-text clinician note (step 9). */
	note: string;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single mandatory-rule row (mirrors the respect_grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-IDENTITY-01. */
	id: string;
	/** Short rule key. */
	rule: string;
	satisfied: boolean;
	category: string;
	description: string;
}

/** A clinician-facing safety / governance flag (mirrors the grade_flag table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A completeness field-slot: contributes to the completeness percentage. */
export interface FieldSlot {
	key: string;
	/** Populated? */
	present: (p: AssessmentData) => boolean;
	/** Counted in the denominator? (defaults to always). */
	applies?: (p: AssessmentData) => boolean;
}

/** A mandatory completeness / validity rule. */
export interface RespectRule {
	id: string;
	rule: string;
	category: string;
	description: string;
	evaluate: (p: AssessmentData) => boolean;
}

/** The full grading result for one plan. */
export interface GradingResult {
	status: Status;
	/** 0..100. */
	completenessPercent: number;
	/** Mandatory rules satisfied (0..8). */
	satisfiedCount: number;
	/** Total mandatory rules (8). */
	mandatoryCount: number;
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
