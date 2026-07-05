// ──────────────────────────────────────────────
// Neurodiversity Adjustment Response — core data types
//
// UK workplace reasonable-adjustments response (Equality Act 2010 / ACAS), NOT
// clinical. Field names are camelCase (front-end serde); they mirror the
// snake_case columns in
// sql/04_create_table_neurodiversity_adjustment_response.sql and
// sql/05_create_table_neurodiversity_adjustment_response_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Response lifecycle status. */
export type ResponseStatus =
	| 'draft'
	| 'agreed'
	| 'partially-agreed'
	| 'trial'
	| 'declined'
	| 'deferred'
	| 'cancelled'
	| '';

/** How the request was handled. */
export type HandlingMethod =
	| 'meeting'
	| 'occupational-health-referral'
	| 'email'
	| 'hr-review'
	| 'other'
	| '';

/** Manager / HR role handling the request. */
export type ManagerRole =
	| 'line-manager'
	| 'hr-adviser'
	| 'occupational-health'
	| 'diversity-lead'
	| 'senior-manager'
	| 'other'
	| '';

/** Overall employer decision. */
export type OverallDecision =
	| 'agreed'
	| 'partially-agreed'
	| 'alternative-offered'
	| 'declined'
	| 'deferred'
	| '';

/** Reasonableness category recorded where an adjustment is declined. */
export type DeclineReasonCategory =
	| 'not-reasonable'
	| 'disproportionate-cost'
	| 'health-and-safety'
	| 'operational-impact'
	| 'alternative-provided'
	| 'insufficient-information'
	| 'none'
	| '';

// ─── Axis enumerations (grade) ───

/** Axis A — outcome classification. */
export type OutcomeClassification =
	| 'fully-agreed'
	| 'partially-agreed'
	| 'alternative-offered'
	| 'declined'
	| 'deferred'
	| '';

/** Axis B — legal / discrimination risk band (reasonableness). */
export type LegalRiskBand = 'ok' | 'caution' | 'high-risk' | '';

/** Axis D — follow-up / review urgency. */
export type FollowUpUrgency =
	| 'none'
	| 'review-scheduled'
	| 'urgent-review'
	| 'escalation-needed'
	| '';

/** Overall recommendation. */
export type Recommendation =
	| 'implement'
	| 'schedule-review'
	| 'seek-occupational-health'
	| 'reconsider-decision'
	| 'escalate-to-hr'
	| '';

// ─── The response record (sql/04) ───

/**
 * The neurodiversity reasonable-adjustments response (employer decision,
 * confirmation, and review) — the source-of-truth record the four-axis grade is
 * computed from.
 */
export interface NeurodiversityAdjustmentResponse {
	// Response identification (author = manager / HR contact)
	managerName: string;
	managerRole: ManagerRole;
	managerJobTitle: string;
	managerDepartment: string;
	managerEmail: string;
	managerPhone: string;
	requestReference: string;
	responseStatus: ResponseStatus;
	handlingMethod: HandlingMethod;
	assessedDate: string;
	respondedDate: string;
	effectiveDate: string;

	// Worker identification (the neurodivergent employee)
	workerName: string;
	workerJobTitle: string;
	workerDepartment: string;
	employeeReference: string;
	workerEmail: string;
	workerPhone: string;

	// Decision
	overallDecision: OverallDecision;
	decisionRationale: string;
	declineReasonCategory: DeclineReasonCategory;

	// Adjustments agreed
	agreedWorkingEnvironment: boolean;
	agreedEquipmentTechnology: boolean;
	agreedWorkingArrangements: boolean;
	agreedCommunication: boolean;
	agreedSupportMentoring: boolean;
	agreedRecruitmentProcess: boolean;
	agreedPolicyDress: boolean;
	agreedOther: boolean;
	agreedAdjustmentsDetail: string;
	alternativeAdjustmentsDetail: string;

	// Trial and review
	trialPeriod: boolean;
	trialPeriodWeeks: number | null;
	reviewScheduled: boolean;
	reviewDate: string;

	// Support, resources, responsibilities
	occupationalHealthReferred: boolean;
	accessToWorkReferred: boolean;
	supportResourcesDetail: string;
	responsibilitiesDetail: string;
	pointOfContact: string;

	// Escalation and sign-off
	escalated: boolean;
	escalationDetail: string;
	notes: string;
	signed: boolean;
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'outcome' | 'legal-risk' | 'completeness' | 'follow-up';

/** Flag category (mirrors the sql/07 CHECK constraint). */
export type FlagCategory =
	| 'discrimination-risk'
	| 'undue-delay'
	| 'no-review-scheduled'
	| 'no-trial-defined'
	| 'grievance-escalation'
	| 'missing-rationale'
	| 'incomplete-response'
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

/** A compliance / risk flag, independent of the four axes. */
export interface Flag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/**
 * The computed four-axis grade. Mirrors
 * sql/05_create_table_neurodiversity_adjustment_response_grade.sql.
 */
export interface GradingResult {
	// Axis A
	outcomeClassification: OutcomeClassification;
	// Axis B
	legalRiskBand: LegalRiskBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	followUpUrgency: FollowUpUrgency;
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

/** A graded response row for the dashboard table. */
export interface ResponseRow {
	id: string;
	workerName: string;
	responseStatus: ResponseStatus;
	respondedDate: string;
	outcomeClassification: OutcomeClassification;
	legalRiskBand: LegalRiskBand;
	followUpUrgency: FollowUpUrgency;
	completenessPercent: number;
	flagCount: number;
}
