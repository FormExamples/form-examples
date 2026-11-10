//! Serde data types for the neurodiversity-adjustment-response payload and
//! grading result.
//!
//! Field names are camelCase on the wire (front-end serde); they mirror the
//! `snake_case` columns in
//! `sql/04_create_table_neurodiversity_adjustment_response.sql` and
//! `sql/05_create_table_neurodiversity_adjustment_response_grade.sql`. Empty
//! string `''` indicates an unanswered enum / text field; `None` indicates an
//! unanswered numeric / date field; `false` an unanswered boolean.

use serde::{Deserialize, Serialize};

// ─── Enumeration aliases (mirror the SQL CHECK constraints) ───

/// Response lifecycle status: `draft` | `agreed` | `partially-agreed` | `trial` | `declined` | `deferred` | `cancelled` | `''`.
pub type ResponseStatus = String;
/// How the request was handled.
pub type HandlingMethod = String;
/// Overall decision: `agreed` | `partially-agreed` | `alternative-offered` | `declined` | `deferred` | `''`.
pub type OverallDecision = String;
/// Reasonableness decline-reason category.
pub type DeclineReasonCategory = String;
/// Axis A — outcome classification.
pub type OutcomeClassification = String;
/// Axis B — legal / discrimination risk band.
pub type LegalRiskBand = String;
/// Axis D — follow-up / review urgency.
pub type FollowUpUrgency = String;
/// Overall recommendation.
pub type Recommendation = String;
/// A scoring axis, used in the fired-rule audit trail.
pub type Axis = String;
/// Flag category (mirrors the sql/07 CHECK constraint).
pub type FlagCategory = String;
/// Flag priority: `low` | `medium` | `high`.
pub type FlagPriority = String;

// ─── The response record (sql/04, plus worker / manager identity fields) ───

/// The neurodiversity reasonable-adjustments response (employer decision,
/// confirmation, and review) — the source-of-truth record the four-axis grade
/// is computed from. The `worker*` and `manager*` fields carry the identity of
/// the two related parties into the pure engine so the completeness axis can
/// score them.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
pub struct NeurodiversityAdjustmentResponse {
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
    /// Manager / HR contact (decision-maker) name.
    pub manager_name: String,
    /// Manager role handling the request.
    pub manager_role: String,

    // Response lifecycle and provenance
    /// Response lifecycle status.
    pub response_status: ResponseStatus,
    /// Reference to the originating reasonable-adjustments request.
    pub request_reference: String,
    /// How the request was handled.
    pub handling_method: HandlingMethod,
    /// Date the request was assessed / discussed with the worker.
    pub assessed_date: String,
    /// Date the response was issued to the worker.
    pub responded_date: String,
    /// Date the agreed adjustments take effect.
    pub effective_date: String,

    // Overall decision
    /// Overall decision.
    pub overall_decision: OverallDecision,
    /// Rationale for the decision (including the reasonableness justification).
    pub decision_rationale: String,
    /// Reasonableness category where any adjustment is declined.
    pub decline_reason_category: DeclineReasonCategory,

    // Adjustments agreed
    /// Agreed adjustment: physical working environment.
    pub agreed_working_environment: bool,
    /// Agreed adjustment: equipment or assistive technology.
    pub agreed_equipment_technology: bool,
    /// Agreed adjustment: working arrangements.
    pub agreed_working_arrangements: bool,
    /// Agreed adjustment: communication.
    pub agreed_communication: bool,
    /// Agreed adjustment: additional support / mentoring.
    pub agreed_support_mentoring: bool,
    /// Agreed adjustment: recruitment / assessment process.
    pub agreed_recruitment_process: bool,
    /// Agreed adjustment: policies (dress code / uniform, absence policy).
    pub agreed_policy_dress: bool,
    /// Agreed adjustment: another adjustment not separately listed.
    pub agreed_other: bool,
    /// Free-text detail of the specific adjustments agreed.
    pub agreed_adjustments_detail: String,
    /// Free-text detail of any alternative adjustments offered.
    pub alternative_adjustments_detail: String,

    // Trial and review
    /// Whether the adjustments are being tried for a trial period.
    pub trial_period: bool,
    /// Length of the trial period in weeks, if a trial applies (0–104).
    pub trial_period_weeks: Option<i32>,
    /// Whether a review of the adjustments has been scheduled.
    pub review_scheduled: bool,
    /// Date the adjustments will be reviewed.
    pub review_date: String,

    // Support, resources, and responsibilities
    /// Whether the worker has been referred to occupational health.
    pub occupational_health_referred: bool,
    /// Whether the worker has been signposted / referred to Access to Work.
    pub access_to_work_referred: bool,
    /// Free-text detail of support resources allocated.
    pub support_resources_detail: String,
    /// Free-text detail of who is responsible for implementing each adjustment.
    pub responsibilities_detail: String,
    /// Named point of contact for the worker.
    pub point_of_contact: String,

    // Escalation and notes
    /// Whether the matter has been escalated (dispute, grievance, appeal).
    pub escalated: bool,
    /// Free-text detail of any escalation, dispute, or appeal.
    pub escalation_detail: String,
    /// Free-text notes accompanying the response.
    pub notes: String,
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/// A single rule that fired during grading (audit trail).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Stable rule identifier (e.g. `R-LEGAL-DECLINE-NO-RATIONALE`).
    pub rule_id: String,
    /// Scoring axis the rule belongs to (`outcome` / `legal-risk` / `completeness` / `follow-up`).
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
    /// Stable flag identifier (e.g. `F-DISCRIMINATION-RISK-001`).
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
/// `sql/05_create_table_neurodiversity_adjustment_response_grade.sql`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Axis A — outcome classification.
    pub outcome_classification: OutcomeClassification,
    /// Axis B — legal / discrimination risk band.
    pub legal_risk_band: LegalRiskBand,
    /// Axis C — response completeness percent (0–100).
    pub completeness_percent: i32,
    /// Axis D — follow-up / review urgency.
    pub follow_up_urgency: FollowUpUrgency,
    /// Axis D — target timeframe for the next review or action.
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

/// A graded response row for the dashboard table.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseRow {
    /// Record id.
    pub id: String,
    /// Worker name.
    pub worker_name: String,
    /// Response status.
    pub response_status: ResponseStatus,
    /// Responded date.
    pub responded_date: String,
    /// Axis A outcome classification.
    pub outcome_classification: OutcomeClassification,
    /// Axis B legal-risk band.
    pub legal_risk_band: LegalRiskBand,
    /// Axis D follow-up urgency.
    pub follow_up_urgency: FollowUpUrgency,
    /// Axis C completeness percent.
    pub completeness_percent: i32,
    /// Number of flags raised.
    pub flag_count: usize,
}
