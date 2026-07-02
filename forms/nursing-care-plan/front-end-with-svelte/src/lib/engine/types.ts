// ──────────────────────────────────────────────
// Core data types (Nursing Care Plan)
//
// A documentation-and-completeness form: the engine GRADES completeness
// (complete / partial / incomplete) per problem and rolls that up to a plan
// status, plus a completeness percent. It is NOT a numeric score.
//
// This is a MULTI-TABLE relational form. camelCase property names mirror the
// snake_case SQL columns across the parent header and its child tables:
//   nursing_care_plan (parent)
//     └─ nursing_care_plan_problem        (child, FK care_plan_id)
//          ├─ nursing_care_plan_goal          (grandchild, FK problem_id)
//          └─ nursing_care_plan_intervention  (grandchild, FK problem_id)
//
// Each problem is worked through the nursing process (ADPIE): it carries an
// assessment, a diagnosis (problem statement + RLT activity of living), one or
// more SMART goals, one or more planned interventions, and an inline
// evaluation.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type RiskLevel = 'low' | 'medium' | 'high' | '';
export type MetStatus = 'met' | 'partially-met' | 'not-met' | 'not-evaluated' | '';
export type CarriedOut = 'yes' | 'no' | 'partial' | '';
export type ActualOrPotential = 'actual' | 'potential' | '';
export type LinkedRisk = 'none' | 'falls' | 'pressure-ulcer' | 'vte' | 'nutrition' | '';

export type NurseRole = 'registered-nurse' | 'nursing-associate' | 'student-nurse' | '';
export type PlanType = 'admission' | 'ongoing' | 'discharge' | '';
export type CareSetting = 'hospital-ward' | 'community' | 'care-home' | 'hospice' | 'other' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';

export type CompletenessClass = 'complete' | 'partial' | 'incomplete';
export type PlanStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/**
 * A referenced risk-assessment group (falls / pressure ulcer / VTE / nutrition).
 * Mirrors the four `*_risk_*` column families on `nursing_care_plan`.
 */
export interface RiskGroup {
	done: YesNo;
	level: RiskLevel;
	/** ISO date or ''. */
	assessedOn: string;
	actioned: YesNo;
}

/** A SMART goal (child of a problem). Mirrors `nursing_care_plan_goal`. */
export interface Goal {
	id: string;
	goalText: string;
	/** ISO target / review date or ''. */
	targetDate: string;
	met: MetStatus;
}

/**
 * A planned nursing intervention (child of a problem). Mirrors
 * `nursing_care_plan_intervention`.
 */
export interface Intervention {
	id: string;
	interventionText: string;
	carriedOut: CarriedOut;
}

/**
 * A nursing problem / need with its goals, interventions, and inline
 * evaluation. Mirrors `nursing_care_plan_problem` plus its child arrays.
 */
export interface Problem {
	id: string;
	problemStatement: string;
	adlCategory: string;
	actualOrPotential: ActualOrPotential;
	assessmentData: string;
	linkedRisk: LinkedRisk;
	goals: Goal[];
	interventions: Intervention[];
	evaluationNote: string;
	goalMet: MetStatus;
	/** ISO date or ''. */
	nextReviewDate: string;
}

/** Step 1 — plan context (parent header fields). */
export interface PlanContext {
	nurseName: string;
	nurseRole: NurseRole;
	nmcNumber: string;
	/** ISO-ish datetime-local string; '' when unset. */
	authoredAt: string;
	careSetting: CareSetting;
	planType: PlanType;
	modelUsed: string;
}

/** Step 2 — patient identification (parent header fields). */
export interface Patient {
	patientIdentifier: string;
	patientName: string;
	/** ISO date or ''. */
	dateOfBirth: string;
	sex: Sex;
	wardLocation: string;
}

/** Step 8 — handover / sign-off summary. */
export interface Summary {
	handoverNote: string;
	/** ISO date or ''. */
	reviewDate: string;
}

/** The full nursing-care-plan data model (parent header + child problems). */
export interface CarePlan {
	planContext: PlanContext;
	patient: Patient;
	fallsRisk: RiskGroup;
	pressureUlcerRisk: RiskGroup;
	vteRisk: RiskGroup;
	nutritionRisk: RiskGroup;
	problems: Problem[];
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single per-problem completeness audit row (mirrors the grade_rule table). */
export interface FiredRule {
	id: string;
	problemId: string;
	problemLabel: string;
	element: 'goal' | 'intervention' | 'evaluation';
	present: boolean;
	description: string;
}

/** A clinician-facing flagged issue (mirrors the grade_flag table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	message: string;
}

/** The per-problem completeness class. */
export interface ProblemClass {
	problemId: string;
	completenessClass: CompletenessClass;
}

/** The full grading result for one care plan. */
export interface GradingResult {
	status: PlanStatus;
	completenessPercent: number;
	problemClasses: ProblemClass[];
	firedRules: FiredRule[];
	flags: FlaggedIssue[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	/** Which data section / wizard concern this step edits. */
	section: string;
}
