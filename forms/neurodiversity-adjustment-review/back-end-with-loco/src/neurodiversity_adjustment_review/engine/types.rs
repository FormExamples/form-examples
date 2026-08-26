//! Serde data types for the neurodiversity-adjustment-review payload and
//! grading result.
//!
//! Field names are camelCase on the wire (front-end serde); they mirror the
//! `snake_case` columns in
//! `sql/04_create_table_neurodiversity_adjustment_review.sql` and
//! `sql/05_create_table_neurodiversity_adjustment_review_grade.sql`. Empty
//! string `''` indicates an unanswered enum / text field; `None` indicates an
//! unanswered numeric / date field; `false` an unanswered boolean.

use serde::{Deserialize, Serialize};

// ─── Enumeration aliases (mirror the SQL CHECK constraints) ───

/// Review lifecycle status: `draft` | `completed` | `changes-agreed` | `escalated` | `cancelled` | `''`.
pub type ReviewStatus = String;
/// How the review was conducted.
pub type ReviewMethod = String;
/// Per-category effectiveness: `working-well` | `partial` | `not-working` | `not-in-place` | `''`.
pub type Effectiveness = String;
/// Whether the worker is satisfied: `yes` | `partially` | `no` | `''`.
pub type WorkerSatisfied = String;
/// Change in the worker's wellbeing: `improved` | `unchanged` | `worse` | `''`.
pub type WellbeingChange = String;
/// Axis A — overall effectiveness band.
pub type EffectivenessBand = String;
/// Axis B — wellbeing risk band.
pub type WellbeingRiskBand = String;
/// Axis D — next-step urgency.
pub type NextStepUrgency = String;
/// Overall recommendation.
pub type Recommendation = String;
/// A scoring axis, used in the fired-rule audit trail.
pub type Axis = String;
/// Flag category (mirrors the sql/07 CHECK constraint).
pub type FlagCategory = String;
/// Flag priority: `low` | `medium` | `high`.
pub type FlagPriority = String;

// ─── The review record (sql/04, plus worker / manager identity fields) ───

/// The neurodiversity reasonable-adjustments review (a periodic check of whether
/// the agreed adjustments are still working) — the source-of-truth record the
/// four-axis grade is computed from. The `worker*` and `manager*` fields carry
/// the identity of the two related parties into the pure engine so the
/// completeness axis can score them.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NeurodiversityAdjustmentReview {
    // Worker identity
    /// Worker (neurodivergent employee) name.
    pub worker_name: String,
    /// Worker job title.
    pub worker_job_title: String,
    /// Worker department.
    pub worker_department: String,
    /// Employer-assigned employee / payroll reference.
    pub worker_employee_reference: String,

    // Manager / HR identity
    /// Manager / HR contact (reviewer) name.
    pub manager_name: String,
    /// Manager role conducting the review.
    pub manager_role: String,

    // Review lifecycle and provenance
    /// Review lifecycle status.
    pub review_status: ReviewStatus,
    /// Reference to the originating response / confirmation being reviewed.
    pub response_reference: String,
    /// How the review was conducted.
    pub review_method: ReviewMethod,
    /// Date the review took place.
    pub review_date: String,
    /// Date of the next scheduled review.
    pub next_review_date: String,

    // Per-category effectiveness of the adjustments in place
    /// Effectiveness of working-environment adjustments.
    pub effectiveness_working_environment: Effectiveness,
    /// Effectiveness of equipment / technology adjustments.
    pub effectiveness_equipment_technology: Effectiveness,
    /// Effectiveness of working-arrangements adjustments.
    pub effectiveness_working_arrangements: Effectiveness,
    /// Effectiveness of communication adjustments.
    pub effectiveness_communication: Effectiveness,
    /// Effectiveness of support / mentoring adjustments.
    pub effectiveness_support_mentoring: Effectiveness,
    /// Effectiveness of recruitment-process adjustments.
    pub effectiveness_recruitment_process: Effectiveness,
    /// Effectiveness of policy / dress-code adjustments.
    pub effectiveness_policy_dress: Effectiveness,
    /// Effectiveness of any other adjustment.
    pub effectiveness_other: Effectiveness,

    // Worker experience and outcomes
    /// The worker's own feedback on how the adjustments are working.
    pub worker_feedback: String,
    /// Whether the worker is satisfied the adjustments meet their needs.
    pub worker_satisfied: WorkerSatisfied,
    /// Change in the worker's wellbeing since the adjustments.
    pub wellbeing_change: WellbeingChange,
    /// Any remaining barriers or difficulties the worker still experiences.
    pub barriers_detail: String,

    // Changes arising from the review
    /// Whether changes to the adjustments are needed as a result of the review.
    pub changes_needed: bool,
    /// Detail of the changes needed.
    pub changes_detail: String,
    /// Detail of the updated / newly agreed adjustments arising from the review.
    pub updated_adjustments_detail: String,
    /// Whether an occupational-health re-referral has been made.
    pub occupational_health_rereferral: bool,

    // Escalation and notes
    /// Whether the matter has been escalated.
    pub escalated: bool,
    /// Free-text detail of any escalation.
    pub escalation_detail: String,
    /// Free-text notes accompanying the review.
    pub notes: String,
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/// A single rule that fired during grading (audit trail).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Stable rule identifier (e.g. `R-EFFECT-INEFFECTIVE`).
    pub rule_id: String,
    /// Scoring axis the rule belongs to (`effectiveness` / `wellbeing` / `completeness` / `next-step`).
    pub axis: Axis,
    /// Category or reason the rule relates to.
    pub category: String,
    /// Human-readable description of why the rule fired.
    pub description: String,
}

/// A compliance / risk flag, independent of the four axes.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Flag {
    /// Stable flag identifier (e.g. `F-ADJUSTMENTS-NOT-WORKING-001`).
    pub flag_id: String,
    /// Flag category.
    pub category: FlagCategory,
    /// Priority.
    pub priority: FlagPriority,
    /// Human-readable description of what fired the flag.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// The computed four-axis grade. Mirrors
/// `sql/05_create_table_neurodiversity_adjustment_review_grade.sql`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Axis A — overall effectiveness band.
    pub effectiveness_band: EffectivenessBand,
    /// Axis B — wellbeing risk band.
    pub wellbeing_risk_band: WellbeingRiskBand,
    /// Axis C — review completeness percent (0–100).
    pub completeness_percent: i32,
    /// Axis D — next-step urgency.
    pub next_step_urgency: NextStepUrgency,
    /// Axis D — target timeframe for the next step.
    pub target_timeframe: String,
    /// Overall recommendation.
    pub recommendation: Recommendation,
    /// Human-readable label for the recommendation.
    pub recommendation_label: String,
    /// Fired-rule audit trail.
    pub fired_rules: Vec<FiredRule>,
    /// Compliance / risk flags.
    pub flags: Vec<Flag>,
    /// ISO-8601 timestamp the grade was computed.
    pub graded_at: String,
}

/// A graded review row for the dashboard table.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReviewRow {
    /// Record id.
    pub id: String,
    /// Worker name.
    pub worker_name: String,
    /// Review status.
    pub review_status: ReviewStatus,
    /// Review date.
    pub review_date: String,
    /// Axis A effectiveness band.
    pub effectiveness_band: EffectivenessBand,
    /// Axis B wellbeing risk band.
    pub wellbeing_risk_band: WellbeingRiskBand,
    /// Axis D next-step urgency.
    pub next_step_urgency: NextStepUrgency,
    /// Axis C completeness percent.
    pub completeness_percent: i32,
    /// Number of flags raised.
    pub flag_count: usize,
}
