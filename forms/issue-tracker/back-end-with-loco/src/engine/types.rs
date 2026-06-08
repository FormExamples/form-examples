//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases for the frontend's `'low' | 'moderate' | 'high' | 'critical'`
// composite band and the rule / flag string discriminators.
/// Band.
pub type Band = String;
/// Composite priority.
pub type CompositePriority = String;

/// Reporter and metadata fields (Step 1 of the 10-step wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reporter {
    /// Reporter name.
    pub reporter_name: String,
    /// Reporter email.
    pub reporter_email: String,
    /// Reporter role.
    pub reporter_role: String,
    /// Reported at.
    pub reported_at: String,
    /// Discovered at.
    pub discovered_at: String,
    /// Issue category.
    pub issue_category: String,
    /// Environment.
    pub environment: String,
    /// System name.
    pub system_name: String,
    /// Component.
    pub component: String,
    /// Customer or project tag.
    pub customer_or_project_tag: String,
    /// External reference.
    pub external_reference: String,
}

/// Section CC — Chief Complaint.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChiefComplaint {
    /// Cc summary.
    pub cc_summary: String,
    /// Cc long description.
    pub cc_long_description: String,
    /// Cc reported by name.
    pub cc_reported_by_name: String,
    /// Cc reported via.
    pub cc_reported_via: String,
}

/// Section Pt — Participants.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Participants {
    /// Pt discoverer name.
    pub pt_discoverer_name: String,
    /// Pt affected users count.
    pub pt_affected_users_count: Option<i32>,
    /// Pt affected user groups.
    pub pt_affected_user_groups: String,
    /// Pt assignees.
    pub pt_assignees: String,
    /// Pt stakeholders to inform.
    pub pt_stakeholders_to_inform: String,
    /// Pt observers.
    pub pt_observers: String,
}

/// Section Sx — Symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Symptoms {
    /// Sx external signals.
    pub sx_external_signals: String,
    /// Sx alert IDs.
    pub sx_alert_ids: String,
    /// Sx error messages.
    pub sx_error_messages: String,
    /// Sx screenshots URL.
    pub sx_screenshots_url: String,
    /// Sx logs URL.
    pub sx_logs_url: String,
    /// Sx first observed at.
    pub sx_first_observed_at: String,
}

/// Section Fx — Fractures (broken components).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Fractures {
    /// Fx broken components.
    pub fx_broken_components: String,
    /// Fx failed services.
    pub fx_failed_services: String,
    /// Fx stuck processes.
    pub fx_stuck_processes: String,
    /// Fx hardware faults.
    pub fx_hardware_faults: String,
    /// Fx data corruption.
    pub fx_data_corruption: String,
}

/// Section Hx — History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct History {
    /// Hx related issues.
    pub hx_related_issues: String,
    /// Hx prior occurrences.
    pub hx_prior_occurrences: Option<i32>,
    /// Hx recent change URL.
    pub hx_recent_change_url: String,
    /// Hx references.
    pub hx_references: String,
    /// Hx timeline.
    pub hx_timeline: String,
}

/// Section Ix — Investigations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    /// Ix hypotheses.
    pub ix_hypotheses: String,
    /// Ix repro steps.
    pub ix_repro_steps: String,
    /// Ix diagnostic queries.
    pub ix_diagnostic_queries: String,
    /// Ix tests run.
    pub ix_tests_run: String,
    /// Ix blocking unknowns.
    pub ix_blocking_unknowns: String,
}

/// Section Dx — Diagnosis.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnosis {
    /// Dx root cause.
    pub dx_root_cause: String,
    /// Dx contributing causes.
    pub dx_contributing_causes: String,
    /// Dx scope.
    pub dx_scope: String,
    /// Dx confirmed.
    pub dx_confirmed: String,
}

/// Sections Tx + Px — Treatments and Prognosis (combined per the wizard).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentsPrognosis {
    /// Tx mitigation steps.
    pub tx_mitigation_steps: String,
    /// Tx fix plan.
    pub tx_fix_plan: String,
    /// Tx workaround.
    pub tx_workaround: String,
    /// Tx rollback plan.
    pub tx_rollback_plan: String,
    /// Tx communication plan.
    pub tx_communication_plan: String,
    /// Px expected resolution at.
    pub px_expected_resolution_at: String,
    /// Px residual risk.
    pub px_residual_risk: String,
    /// Px monitoring plan.
    pub px_monitoring_plan: String,
    /// Px recurrence likelihood.
    pub px_recurrence_likelihood: String,
    /// Px lessons learned.
    pub px_lessons_learned: String,
}

/// Seven raw input scores recorded on Step 10 (Score & sign-off).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Scores {
    /// Score by priority rank.
    pub score_by_priority_rank: Option<i32>,
    /// Score by severity of impact.
    pub score_by_severity_of_impact: Option<i32>,
    /// Score by magnitude of damage.
    pub score_by_magnitude_of_damage: Option<i32>,
    /// Score by harm grade.
    pub score_by_harm_grade: Option<i32>,
    /// Score by failure condition.
    pub score_by_failure_condition: String,
    /// Score by moscow requirement.
    pub score_by_moscow_requirement: Option<i32>,
    /// Score by frequency percent.
    pub score_by_frequency_percent: Option<f64>,
}

/// Full issue-tracker assessment record (the JSONB `data` blob shape).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Reporter.
    pub reporter: Reporter,
    /// Cc.
    pub cc: ChiefComplaint,
    /// Pt.
    pub pt: Participants,
    /// Sx.
    pub sx: Symptoms,
    /// Fx.
    pub fx: Fractures,
    /// Hx.
    pub hx: History,
    /// Ix.
    pub ix: Investigations,
    /// Dx.
    pub dx: Diagnosis,
    /// Txpx.
    pub txpx: TreatmentsPrognosis,
    /// Scores.
    pub scores: Scores,
}

/// A scoring rule that fired during grading. Mirrors the front-end's
/// `FiredRule` shape exactly (ruleId / instrument / grade / category /
/// description / band).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// Instrument.
    pub instrument: String,
    /// Grade.
    pub grade: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Band.
    pub band: Band,
}

/// A safety flag emitted by the flag detector. Mirrors the front-end's
/// `AdditionalFlag` shape exactly (flagId / category / priority /
/// description / suggestedAction).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// Priority.
    pub priority: String,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// Output of `grade()` — mirrors the TypeScript `GradeResult` shape: the
/// seven scores echo back through, plus the composite band, fired rules,
/// and additional flags.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Score by priority rank.
    pub score_by_priority_rank: Option<i32>,
    /// Score by severity of impact.
    pub score_by_severity_of_impact: Option<i32>,
    /// Score by magnitude of damage.
    pub score_by_magnitude_of_damage: Option<i32>,
    /// Score by harm grade.
    pub score_by_harm_grade: Option<i32>,
    /// Score by failure condition.
    pub score_by_failure_condition: String,
    /// Score by moscow requirement.
    pub score_by_moscow_requirement: Option<i32>,
    /// Score by frequency percent.
    pub score_by_frequency_percent: Option<f64>,
    /// Composite priority.
    pub composite_priority: CompositePriority,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
