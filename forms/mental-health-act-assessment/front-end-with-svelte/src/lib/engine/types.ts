// ──────────────────────────────────────────────
// Core assessment data types (Mental Health Act Assessment)
//
// This is a LEGAL and CLINICAL DOCUMENTATION instrument, not a numeric severity
// score and NOT an automated decision to detain. The engine classifies the
// recommended section, validates that the documentation the section requires is
// complete (`valid` / `incomplete`), classifies the urgency, and raises flagged
// issues. The prescribed statutory forms remain the definitive legal record.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_mental_health_act_assessment.sql`. Text / enum fields
// default to `''`; date / time fields default to `''` (datetime-local strings).
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Criterion = 'met' | 'not-met' | 'not-applicable' | '';
export type Location =
	| 'hospital-ward'
	| 'emergency-department'
	| 'place-of-safety'
	| 'care-home'
	| 'community'
	| 'other'
	| '';
export type AgeBand = 'child' | 'adolescent' | 'adult' | 'older-adult' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type RiskImminence = 'none' | 'low' | 'moderate' | 'imminent' | '';
export type ConsultedStatus = 'yes' | 'no' | 'not-practicable' | '';
export type ObjectionStatus = 'yes' | 'no' | 'unknown' | '';
export type RecommendedSection = '2' | '3' | '4' | '5-2' | '5-4' | '136' | 'none' | '';
export type Outcome = 'detain-under-section' | 'informal-admission' | 'community' | 'no-action' | '';
export type Conveyance = 'ambulance' | 'police' | 'self' | 'other' | '';

export type CompletenessStatus = 'valid' | 'incomplete';
export type RecommendedSectionClass =
	| 'section-2'
	| 'section-3'
	| 'section-4'
	| 'section-5-2'
	| 'section-5-4'
	| 'section-136'
	| 'none';
export type UrgencyClass = 'routine' | 'urgent' | 'emergency';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	location: Location;
	referralSource: string;
	reasonForAssessment: string;
}

/** Step 2 — person identification. */
export interface Identification {
	personIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	firstLanguage: string;
}

/** Step 3 — assessing professionals. */
export interface Professionals {
	amhpName: string;
	amhpApproved: YesNo;
	doctor1Name: string;
	doctor1GmcNumber: string;
	doctor1Section12Approved: YesNo;
	/** ISO-ish datetime-local string; '' when unset. */
	doctor1ExaminedAt: string;
	doctor2Name: string;
	doctor2GmcNumber: string;
	doctor2Section12Approved: YesNo;
	/** ISO-ish datetime-local string; '' when unset. */
	doctor2ExaminedAt: string;
	priorAcquaintance: YesNo;
}

/** Step 4 — mental disorder criterion. */
export interface MentalDisorder {
	mentalDisorderPresent: Criterion;
	mentalDisorderEvidence: string;
}

/** Step 5 — risk criteria. */
export interface Risk {
	riskToOwnHealth: Criterion;
	riskToOwnSafety: Criterion;
	riskToOthers: Criterion;
	riskEvidence: string;
	riskImminence: RiskImminence;
}

/** Step 6 — least-restrictive alternative criterion. */
export interface LeastRestrictive {
	leastRestrictiveMet: Criterion;
	alternativesConsidered: string;
}

/** Step 7 — appropriate medical treatment criterion (required for s3). */
export interface Treatment {
	appropriateTreatmentAvailable: Criterion;
	treatmentPlanSummary: string;
}

/** Step 8 — nearest relative / consultees. */
export interface NearestRelative {
	nearestRelativeIdentified: YesNo;
	nearestRelativeConsulted: ConsultedStatus;
	nearestRelativeObjection: ObjectionStatus;
	consultationRecord: string;
}

/** Step 9 — recommendation and outcome. */
export interface Recommendation {
	recommendedSection: RecommendedSection;
	outcome: Outcome;
	bedIdentified: YesNo;
	conveyance: Conveyance;
	clinicalLegalNote: string;
}

/** The full Mental Health Act assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	professionals: Professionals;
	mentalDisorder: MentalDisorder;
	risk: Risk;
	leastRestrictive: LeastRestrictive;
	treatment: Treatment;
	nearestRelative: NearestRelative;
	recommendation: Recommendation;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A required-signatory slot evaluated present / absent (mirrors grade_rule). */
export interface RequiredSignatory {
	/** Stable key, e.g. 'amhp', 'doctor1', 'doctor2', 's12'. */
	role: string;
	label: string;
	present: boolean;
}

/** A required-criterion slot evaluated met / not-met + evidence (grade_rule). */
export interface CriterionResult {
	/** Stable key, e.g. 'mental-disorder', 'risk'. */
	criterion: string;
	label: string;
	status: Criterion;
	evidencePresent: boolean;
}

/** A clinician-facing safety / legal / governance flag (mirrors grade_flag). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full classification / validation result for one assessment. */
export interface GradingResult {
	completenessStatus: CompletenessStatus;
	recommendedSectionClass: RecommendedSectionClass;
	urgencyClass: UrgencyClass;
	requiredSignatories: RequiredSignatory[];
	criteriaSummary: CriterionResult[];
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
