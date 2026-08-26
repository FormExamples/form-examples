//! Core data types for the Neurodiversity Adjustment Request four-axis engine.
//!
//! These mirror `front-end-with-svelte/src/lib/engine/types.ts` exactly:
//! the field names are camelCase on the wire (`serde(rename_all = "camelCase")`)
//! and `snake_case` in the SQL columns. Enumerated values are kept as plain
//! `String`s so an empty string `''` represents an unanswered enum field, and
//! `Option<_>` represents an unanswered numeric / date field — matching the
//! monorepo convention.

use serde::{Deserialize, Serialize};

/// The neurodiversity workplace reasonable-adjustments request — the
/// source-of-truth record the four-axis grade is computed from. Mirrors
/// `sql/04_create_table_neurodiversity_adjustment_request.sql` (plus the worker
/// and manager fields the engine reads for completeness).
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
#[derive(Default)]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
pub struct NeurodiversityAdjustmentRequest {
    // Worker (the neurodivergent employee)
    /// Worker name.
    pub worker_name: String,
    /// Worker job title / role.
    pub worker_job_title: String,
    /// Worker department / team.
    pub worker_department: String,
    /// Worker employment type (permanent, fixed-term, agency, …).
    pub worker_employment_type: String,
    /// Worker working pattern (full-time, part-time, shift, …).
    pub worker_work_pattern: String,
    /// Worker primary work location (office, remote, hybrid, …).
    pub worker_work_location: String,
    /// Worker employment start date (ISO-8601 date, or empty).
    pub worker_employment_start_date: String,
    /// Employer-assigned employee / payroll reference.
    pub worker_employee_reference: String,
    /// Worker email address.
    pub worker_email: String,
    /// Worker phone number.
    pub worker_phone: String,

    // Manager / HR contact handling the request
    /// Manager / HR contact name.
    pub manager_name: String,
    /// Manager role (line-manager, hr-adviser, occupational-health, …).
    pub manager_role: String,
    /// Manager job title.
    pub manager_job_title: String,
    /// Manager department.
    pub manager_department: String,
    /// Manager email address.
    pub manager_email: String,
    /// Manager phone number.
    pub manager_phone: String,

    // Request lifecycle
    /// Request lifecycle status.
    pub status: String,
    /// Who initiated the request (worker, manager, occupational-health, other).
    pub requested_by: String,
    /// Date the request was made (ISO-8601 date, or empty).
    pub request_date: String,
    /// Proposed start date for the requested adjustments (ISO-8601, or empty).
    pub requested_start_date: String,

    // Neurodivergent profile
    /// Neurodivergent profile: ADHD.
    pub condition_adhd: bool,
    /// Neurodivergent profile: autism.
    pub condition_autism: bool,
    /// Neurodivergent profile: dyslexia.
    pub condition_dyslexia: bool,
    /// Neurodivergent profile: dyspraxia.
    pub condition_dyspraxia: bool,
    /// Neurodivergent profile: dyscalculia.
    pub condition_dyscalculia: bool,
    /// Neurodivergent profile: Tourette's / tic disorder.
    pub condition_tourettes: bool,
    /// Neurodivergent profile: another form of neurodivergence.
    pub condition_other: bool,
    /// Free-text detail of the other neurodivergent condition(s).
    pub condition_other_detail: String,
    /// Diagnosis status (diagnosed, self-identified, awaiting-assessment, …).
    pub diagnosis_status: String,
    /// Whether the worker considers their neurodivergence a disability.
    pub considers_disability: String,
    /// Whether there is a substantial and long-term adverse effect (the
    /// Equality Act 2010 disability test).
    pub substantial_long_term_impact: bool,
    /// Whether the worker consents to sharing details with HR / OH.
    pub disclosure_consent: bool,

    // Functional difficulties
    /// Functional difficulty: concentration / focus.
    pub difficulty_concentration: bool,
    /// Functional difficulty: reading / written communication.
    pub difficulty_written_communication: bool,
    /// Functional difficulty: organisation and time management.
    pub difficulty_organisation_time: bool,
    /// Functional difficulty: sensory overload.
    pub difficulty_sensory_overload: bool,
    /// Functional difficulty: balance and coordination.
    pub difficulty_balance_coordination: bool,
    /// Functional difficulty: social interaction / verbal communication.
    pub difficulty_social_communication: bool,
    /// Functional difficulty: working memory / recall.
    pub difficulty_memory: bool,
    /// Functional difficulty: fatigue, burnout, and wellbeing.
    pub difficulty_burnout_wellbeing: bool,
    /// Specific tasks and situations where the difficulties cause disadvantage.
    pub tasks_situations_affected: String,
    /// Strengths the worker brings that adjustments can help them make the most of.
    pub worker_strengths: String,

    // Requested adjustments
    /// Requested adjustment: physical working environment.
    pub adjustment_working_environment: bool,
    /// Requested adjustment: equipment or assistive technology.
    pub adjustment_equipment_technology: bool,
    /// Requested adjustment: working arrangements (flexible hours, remote, …).
    pub adjustment_working_arrangements: bool,
    /// Requested adjustment: communication.
    pub adjustment_communication: bool,
    /// Requested adjustment: support / mentoring.
    pub adjustment_support_mentoring: bool,
    /// Requested adjustment: recruitment / assessment process.
    pub adjustment_recruitment_process: bool,
    /// Requested adjustment: policy / dress code.
    pub adjustment_policy_dress: bool,
    /// Requested adjustment: another adjustment not separately listed.
    pub adjustment_other: bool,
    /// Free-text detail of the specific adjustments requested.
    pub adjustments_requested_detail: String,

    // Supporting evidence
    /// Type of supporting evidence supplied.
    pub supporting_evidence_type: String,
    /// Whether occupational health has been or should be involved.
    pub occupational_health_involved: bool,
    /// Whether the Access to Work scheme is involved or applied for.
    pub access_to_work_involved: bool,

    // Impact and urgency
    /// Current impact of the unadjusted difficulties (low / moderate / high / severe).
    pub current_impact: String,
    /// Whether the worker is at risk of sickness absence or burnout.
    pub at_risk_of_absence: bool,
    /// Requested handling urgency (routine / soon / urgent).
    pub urgency: String,
    /// Free-text notes accompanying the request.
    pub notes: String,
}


/// A single rule that fired during grading (audit trail). Mirrors
/// `sql/06_create_table_neurodiversity_adjustment_request_grade_rule.sql`.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Stable rule identifier (e.g. `R-ELIG-SUBSTANTIAL-LONG-TERM`).
    pub rule_id: String,
    /// Scoring axis the rule belongs to (eligibility / impact / completeness / priority).
    pub axis: String,
    /// Category or reason the rule relates to.
    pub category: String,
    /// Human-readable description of why the rule fired.
    pub description: String,
}

impl FiredRule {
    /// Construct a fired rule from string-likes.
    #[must_use]
    pub fn new(rule_id: &str, axis: &str, category: &str, description: &str) -> Self {
        Self {
            rule_id: rule_id.to_string(),
            axis: axis.to_string(),
            category: category.to_string(),
            description: description.to_string(),
        }
    }
}

/// A compliance / wellbeing flag, independent of the four axes. Mirrors
/// `sql/07_create_table_neurodiversity_adjustment_request_grade_flag.sql`.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Flag {
    /// Stable flag identifier (e.g. `F-DISABILITY-DUTY-001`).
    pub flag_id: String,
    /// Flag category.
    pub category: String,
    /// Flag priority (`low` / `medium` / `high`).
    pub priority: String,
    /// Human-readable description of what fired the flag.
    pub description: String,
    /// Suggested action for the manager / HR contact.
    pub suggested_action: String,
}

/// The computed four-axis grade. Mirrors
/// `sql/05_create_table_neurodiversity_adjustment_request_grade.sql`.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Axis A — Equality Act 2010 eligibility.
    pub eligibility_band: String,
    /// Axis B — impact / wellbeing risk.
    pub impact_band: String,
    /// Axis C — request completeness (0–100, weighted).
    pub completeness_percent: i32,
    /// Axis D — handling priority.
    pub priority_tier: String,
    /// Target timeframe implied by the priority tier.
    pub target_timeframe: String,
    /// Overall handling recommendation.
    pub recommendation: String,
    /// Human-readable label for the recommendation.
    pub recommendation_label: String,
    /// Audit trail of every rule that fired, in firing order.
    pub fired_rules: Vec<FiredRule>,
    /// Compliance / wellbeing flags, sorted high → medium → low.
    pub flags: Vec<Flag>,
    /// Timestamp when the engine computed the grade (ISO-8601).
    pub graded_at: String,
}
