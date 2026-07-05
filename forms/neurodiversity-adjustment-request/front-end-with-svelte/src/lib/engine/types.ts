// ──────────────────────────────────────────────
// Neurodiversity Adjustment Request — core data types
//
// UK workplace reasonable-adjustments request for neurodiversity (Equality Act
// 2010 / ACAS), NOT a clinical form. Field names are camelCase (front-end
// serde); they mirror the snake_case columns in
// sql/02_create_table_worker.sql, sql/03_create_table_manager.sql,
// sql/04_create_table_neurodiversity_adjustment_request.sql and
// sql/05_create_table_neurodiversity_adjustment_request_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Request lifecycle status. */
export type RequestStatus =
	| 'draft'
	| 'submitted'
	| 'under-review'
	| 'agreed'
	| 'partially-agreed'
	| 'declined'
	| 'withdrawn'
	| '';

/** Who initiated the request. */
export type RequestedBy = 'worker' | 'manager' | 'occupational-health' | 'other' | '';

/** Worker employment type. */
export type EmploymentType =
	| 'permanent'
	| 'fixed-term'
	| 'agency'
	| 'contractor'
	| 'apprentice'
	| 'volunteer'
	| 'other'
	| '';

/** Worker working pattern. */
export type WorkPattern = 'full-time' | 'part-time' | 'shift' | 'flexible' | 'other' | '';

/** Worker primary work location. */
export type WorkLocation = 'office' | 'remote' | 'hybrid' | 'field' | 'other' | '';

/** Manager / HR contact role handling the request. */
export type ManagerRole =
	| 'line-manager'
	| 'hr-adviser'
	| 'occupational-health'
	| 'diversity-lead'
	| 'senior-manager'
	| 'other'
	| '';

/** Diagnosis status (a formal diagnosis is not required for the duty to apply). */
export type DiagnosisStatus =
	| 'diagnosed'
	| 'self-identified'
	| 'awaiting-assessment'
	| 'prefer-not-to-say'
	| '';

/** Whether the worker considers their neurodivergence a disability. */
export type ConsidersDisability = 'yes' | 'no' | 'unsure' | 'prefer-not-to-say' | '';

/** Type of supporting evidence supplied. */
export type SupportingEvidenceType =
	| 'occupational-health'
	| 'gp-letter'
	| 'diagnostic-report'
	| 'access-to-work'
	| 'none'
	| '';

/** Current impact of the unadjusted difficulties on work and wellbeing. */
export type CurrentImpact = 'low' | 'moderate' | 'high' | 'severe' | '';

/** Requested handling urgency. */
export type Urgency = 'routine' | 'soon' | 'urgent' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — Equality Act 2010 eligibility. */
export type EligibilityBand = 'likely-covered' | 'possibly-covered' | 'unclear' | '';

/** Axis B — impact / wellbeing risk. */
export type ImpactBand = 'ok' | 'caution' | 'high-risk' | '';

/** Axis D — handling priority. */
export type PriorityTier = 'routine' | 'soon' | 'urgent' | '';

/** Overall handling recommendation. */
export type Recommendation =
	| 'progress-to-meeting'
	| 'seek-occupational-health'
	| 'request-more-detail'
	| 'signpost-access-to-work'
	| '';

// ─── The request record (sql/02–04, flattened for the front-end) ───

/**
 * The neurodiversity workplace reasonable-adjustments request — the
 * source-of-truth record the four-axis grade is computed from. Worker and
 * manager fields are flattened into this single interface for the front-end.
 */
export interface NeurodiversityAdjustmentRequest {
	// Worker & role (sql/02 worker)
	workerName: string;
	workerJobTitle: string;
	workerDepartment: string;
	employmentType: EmploymentType;
	workPattern: WorkPattern;
	workLocation: WorkLocation;
	employmentStartDate: string;
	employeeReference: string;
	workerEmail: string;
	workerPhone: string;

	// Handler (sql/03 manager)
	managerName: string;
	managerRole: ManagerRole;
	managerJobTitle: string;
	managerDepartment: string;
	managerEmail: string;
	managerPhone: string;

	// Request lifecycle
	status: RequestStatus;
	requestedBy: RequestedBy;
	requestDate: string;
	requestedStartDate: string;

	// Neurodivergent profile
	conditionAdhd: boolean;
	conditionAutism: boolean;
	conditionDyslexia: boolean;
	conditionDyspraxia: boolean;
	conditionDyscalculia: boolean;
	conditionTourettes: boolean;
	conditionOther: boolean;
	conditionOtherDetail: string;
	diagnosisStatus: DiagnosisStatus;
	considersDisability: ConsidersDisability;
	substantialLongTermImpact: boolean;
	disclosureConsent: boolean;

	// Functional difficulties
	difficultyConcentration: boolean;
	difficultyWrittenCommunication: boolean;
	difficultyOrganisationTime: boolean;
	difficultySensoryOverload: boolean;
	difficultyBalanceCoordination: boolean;
	difficultySocialCommunication: boolean;
	difficultyMemory: boolean;
	difficultyBurnoutWellbeing: boolean;
	tasksSituationsAffected: string;
	workerStrengths: string;

	// Requested adjustments
	adjustmentWorkingEnvironment: boolean;
	adjustmentEquipmentTechnology: boolean;
	adjustmentWorkingArrangements: boolean;
	adjustmentCommunication: boolean;
	adjustmentSupportMentoring: boolean;
	adjustmentRecruitmentProcess: boolean;
	adjustmentPolicyDress: boolean;
	adjustmentOther: boolean;
	adjustmentsRequestedDetail: string;

	// Supporting evidence
	supportingEvidenceType: SupportingEvidenceType;
	occupationalHealthInvolved: boolean;
	accessToWorkInvolved: boolean;

	// Impact and urgency
	currentImpact: CurrentImpact;
	atRiskOfAbsence: boolean;
	urgency: Urgency;
	notes: string;
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'eligibility' | 'impact' | 'completeness' | 'priority';

/** Flag category (mirrors the sql/07 CHECK constraint). */
export type FlagCategory =
	| 'disability-duty-engaged'
	| 'burnout-risk'
	| 'no-consent-to-share'
	| 'missing-adjustments'
	| 'missing-difficulties'
	| 'access-to-work-recommended'
	| 'occupational-health-recommended'
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

/** A compliance-and-wellbeing flag, independent of the four axes. */
export interface Flag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/**
 * The computed four-axis grade. Mirrors
 * sql/05_create_table_neurodiversity_adjustment_request_grade.sql.
 */
export interface GradingResult {
	// Axis A
	eligibilityBand: EligibilityBand;
	// Axis B
	impactBand: ImpactBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	priorityTier: PriorityTier;
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

/** A graded request row for the handling dashboard table. */
export interface RequestRow {
	id: string;
	workerName: string;
	workerJobTitle: string;
	status: RequestStatus;
	requestDate: string;
	eligibilityBand: EligibilityBand;
	impactBand: ImpactBand;
	completenessPercent: number;
	priorityTier: PriorityTier;
	recommendation: Recommendation;
	flagCount: number;
}
