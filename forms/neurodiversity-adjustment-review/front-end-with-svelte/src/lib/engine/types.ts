// ──────────────────────────────────────────────
// Neurodiversity Adjustment Review — core data types
//
// UK workplace reasonable-adjustments review (Equality Act 2010 / ACAS), NOT
// clinical. Field names are camelCase (front-end serde); they mirror the
// snake_case columns in
// sql/04_create_table_neurodiversity_adjustment_review.sql and
// sql/05_create_table_neurodiversity_adjustment_review_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Review lifecycle status. */
export type ReviewStatus =
	| 'draft'
	| 'completed'
	| 'changes-agreed'
	| 'escalated'
	| 'cancelled'
	| '';

/** How the review was conducted. */
export type ReviewMethod =
	| 'meeting'
	| 'occupational-health-review'
	| 'email'
	| 'hr-review'
	| 'other'
	| '';

/** Manager / HR role conducting the review. */
export type ManagerRole =
	| 'line-manager'
	| 'hr-adviser'
	| 'occupational-health'
	| 'diversity-lead'
	| 'senior-manager'
	| 'other'
	| '';

/** Per-category effectiveness of an adjustment in place. */
export type EffectivenessRating =
	| 'working-well'
	| 'partial'
	| 'not-working'
	| 'not-in-place'
	| '';

/** Whether the worker is satisfied the adjustments meet their needs. */
export type WorkerSatisfied = 'yes' | 'partially' | 'no' | '';

/** Change in the worker's wellbeing since the adjustments were put in place. */
export type WellbeingChange = 'improved' | 'unchanged' | 'worse' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — overall effectiveness band. */
export type EffectivenessBand =
	| 'effective'
	| 'partially-effective'
	| 'ineffective'
	| 'not-yet-assessed'
	| '';

/** Axis B — wellbeing risk band. */
export type WellbeingRiskBand = 'ok' | 'caution' | 'high-risk' | '';

/** Axis D — next-step urgency. */
export type NextStepUrgency =
	| 'none'
	| 'review-scheduled'
	| 'adjust-now'
	| 'escalate'
	| '';

/** Overall recommendation. */
export type Recommendation =
	| 'maintain'
	| 'adjust-adjustments'
	| 'seek-occupational-health'
	| 'schedule-next-review'
	| 'escalate-to-hr'
	| '';

// ─── The review record (sql/04) ───

/**
 * The neurodiversity reasonable-adjustments review (a periodic effectiveness
 * check of the adjustments in place) — the source-of-truth record the four-axis
 * grade is computed from.
 */
export interface NeurodiversityAdjustmentReview {
	// Review identification (author = reviewer: manager / HR contact)
	managerName: string;
	managerRole: ManagerRole;
	managerJobTitle: string;
	managerDepartment: string;
	managerEmail: string;
	managerPhone: string;
	responseReference: string;
	reviewStatus: ReviewStatus;
	reviewMethod: ReviewMethod;
	reviewDate: string;
	nextReviewDate: string;

	// Worker identification (the neurodivergent employee)
	workerName: string;
	workerJobTitle: string;
	workerDepartment: string;
	employeeReference: string;
	workerEmail: string;
	workerPhone: string;

	// Effectiveness of the adjustments in place (per ACAS category)
	effectivenessWorkingEnvironment: EffectivenessRating;
	effectivenessEquipmentTechnology: EffectivenessRating;
	effectivenessWorkingArrangements: EffectivenessRating;
	effectivenessCommunication: EffectivenessRating;
	effectivenessSupportMentoring: EffectivenessRating;
	effectivenessRecruitmentProcess: EffectivenessRating;
	effectivenessPolicyDress: EffectivenessRating;
	effectivenessOther: EffectivenessRating;

	// Worker experience and outcomes
	workerFeedback: string;
	workerSatisfied: WorkerSatisfied;
	wellbeingChange: WellbeingChange;
	barriersDetail: string;

	// Changes arising from the review
	changesNeeded: boolean;
	changesDetail: string;
	updatedAdjustmentsDetail: string;
	occupationalHealthRereferral: boolean;

	// Escalation and sign-off
	escalated: boolean;
	escalationDetail: string;
	notes: string;
	signed: boolean;
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'effectiveness' | 'wellbeing' | 'completeness' | 'next-step';

/** Flag category (mirrors the sql/07 CHECK constraint). */
export type FlagCategory =
	| 'adjustments-not-working'
	| 'worker-dissatisfied'
	| 'wellbeing-declined'
	| 'changes-outstanding'
	| 'no-next-review'
	| 'escalation'
	| 'incomplete-review'
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
 * sql/05_create_table_neurodiversity_adjustment_review_grade.sql.
 */
export interface GradingResult {
	// Axis A
	effectivenessBand: EffectivenessBand;
	// Axis B
	wellbeingRiskBand: WellbeingRiskBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	nextStepUrgency: NextStepUrgency;
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

/** A graded review row for the dashboard table. */
export interface ReviewRow {
	id: string;
	workerName: string;
	reviewStatus: ReviewStatus;
	reviewDate: string;
	effectivenessBand: EffectivenessBand;
	wellbeingRiskBand: WellbeingRiskBand;
	nextStepUrgency: NextStepUrgency;
	completenessPercent: number;
	flagCount: number;
}
