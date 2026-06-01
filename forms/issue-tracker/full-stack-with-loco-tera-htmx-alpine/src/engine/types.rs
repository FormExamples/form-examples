use serde::{Deserialize, Serialize};

// Type aliases for the frontend's `'low' | 'moderate' | 'high' | 'critical'`
// composite band and the rule / flag string discriminators.
pub type Band = String;
pub type CompositePriority = String;

/// Reporter and metadata fields (Step 1 of the 10-step wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reporter {
    pub reporter_name: String,
    pub reporter_email: String,
    pub reporter_role: String,
    pub reported_at: String,
    pub discovered_at: String,
    pub issue_category: String,
    pub environment: String,
    pub system_name: String,
    pub component: String,
    pub customer_or_project_tag: String,
    pub external_reference: String,
}

/// Section CC — Chief Complaint.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChiefComplaint {
    pub cc_summary: String,
    pub cc_long_description: String,
    pub cc_reported_by_name: String,
    pub cc_reported_via: String,
}

/// Section Pt — Participants.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Participants {
    pub pt_discoverer_name: String,
    pub pt_affected_users_count: Option<i32>,
    pub pt_affected_user_groups: String,
    pub pt_assignees: String,
    pub pt_stakeholders_to_inform: String,
    pub pt_observers: String,
}

/// Section Sx — Symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Symptoms {
    pub sx_external_signals: String,
    pub sx_alert_ids: String,
    pub sx_error_messages: String,
    pub sx_screenshots_url: String,
    pub sx_logs_url: String,
    pub sx_first_observed_at: String,
}

/// Section Fx — Fractures (broken components).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Fractures {
    pub fx_broken_components: String,
    pub fx_failed_services: String,
    pub fx_stuck_processes: String,
    pub fx_hardware_faults: String,
    pub fx_data_corruption: String,
}

/// Section Hx — History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct History {
    pub hx_related_issues: String,
    pub hx_prior_occurrences: Option<i32>,
    pub hx_recent_change_url: String,
    pub hx_references: String,
    pub hx_timeline: String,
}

/// Section Ix — Investigations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    pub ix_hypotheses: String,
    pub ix_repro_steps: String,
    pub ix_diagnostic_queries: String,
    pub ix_tests_run: String,
    pub ix_blocking_unknowns: String,
}

/// Section Dx — Diagnosis.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnosis {
    pub dx_root_cause: String,
    pub dx_contributing_causes: String,
    pub dx_scope: String,
    pub dx_confirmed: String,
}

/// Sections Tx + Px — Treatments and Prognosis (combined per the wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentsPrognosis {
    pub tx_mitigation_steps: String,
    pub tx_fix_plan: String,
    pub tx_workaround: String,
    pub tx_rollback_plan: String,
    pub tx_communication_plan: String,
    pub px_expected_resolution_at: String,
    pub px_residual_risk: String,
    pub px_monitoring_plan: String,
    pub px_recurrence_likelihood: String,
    pub px_lessons_learned: String,
}

/// Seven raw input scores recorded on Step 10 (Score & sign-off).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Scores {
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<i32>,
    pub score_by_magnitude_of_damage: Option<i32>,
    pub score_by_harm_grade: Option<i32>,
    pub score_by_failure_condition: String,
    pub score_by_moscow_requirement: Option<i32>,
    pub score_by_frequency_percent: Option<f64>,
}

/// Full issue-tracker assessment record (the JSONB `data` blob shape).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub reporter: Reporter,
    pub cc: ChiefComplaint,
    pub pt: Participants,
    pub sx: Symptoms,
    pub fx: Fractures,
    pub hx: History,
    pub ix: Investigations,
    pub dx: Diagnosis,
    pub txpx: TreatmentsPrognosis,
    pub scores: Scores,
}

/// A scoring rule that fired during grading. Mirrors the front-end's
/// `FiredRule` shape exactly (ruleId / instrument / grade / category /
/// description / band).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub instrument: String,
    pub grade: String,
    pub category: String,
    pub description: String,
    pub band: Band,
}

/// A safety flag emitted by the flag detector. Mirrors the front-end's
/// `AdditionalFlag` shape exactly (flagId / category / priority /
/// description / suggestedAction).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: String,
    pub category: String,
    pub priority: String,
    pub description: String,
    pub suggested_action: String,
}

/// Output of `grade()` — mirrors the TypeScript `GradeResult` shape: the
/// seven scores echo back through, plus the composite band, fired rules,
/// and additional flags.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<i32>,
    pub score_by_magnitude_of_damage: Option<i32>,
    pub score_by_harm_grade: Option<i32>,
    pub score_by_failure_condition: String,
    pub score_by_moscow_requirement: Option<i32>,
    pub score_by_frequency_percent: Option<f64>,
    pub composite_priority: CompositePriority,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
