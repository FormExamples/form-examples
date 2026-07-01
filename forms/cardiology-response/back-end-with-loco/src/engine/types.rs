//! Serde data types for the cardiology-response payload and grading result.
//!
//! Field names are camelCase on the wire (front-end serde); they mirror the
//! snake_case columns in `sql/04_create_table_cardiology_response.sql` and
//! `sql/05_create_table_cardiology_response_grade.sql`. Empty string `''`
//! indicates an unanswered enum / text field; `None` indicates an unanswered
//! numeric / date field.

use serde::{Deserialize, Serialize};

// ─── Enumeration aliases (mirror the SQL CHECK constraints) ───

/// Response lifecycle status: `preliminary` | `final` | `amended` | `cancelled` | `''`.
pub type ResponseStatus = String;
/// Type of cardiology consultation.
pub type ConsultationType = String;
/// Primary diagnosis category.
pub type PrimaryDiagnosisCategory = String;
/// Axis A — overall response classification.
pub type ResponseClassification = String;
/// Axis B — condition severity.
pub type Severity = String;
/// Axis D — follow-up urgency.
pub type FollowUpUrgency = String;
/// Overall recommendation.
pub type Recommendation = String;
/// A scoring axis, used in the fired-rule audit trail.
pub type Axis = String;
/// Flag category (mirrors the sql/07 CHECK constraint).
pub type FlagCategory = String;
/// Flag priority: `low` | `medium` | `high`.
pub type FlagPriority = String;

// ─── The response record (sql/04) ───

/// The cardiology response (consult reply) — the source-of-truth record the
/// four-axis interpretation grade is computed from.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CardiologyResponse {
    // Response identification
    /// Responding clinician (author / signer).
    pub responding_clinician: String,
    /// Free-text reference back to the originating cardiology referral request.
    pub originating_request_reference: String,
    /// Response lifecycle status.
    pub response_status: ResponseStatus,
    /// Type of cardiology consultation.
    pub consultation_type: ConsultationType,
    /// Date the patient was assessed / reviewed.
    pub assessed_date: String,
    /// Date the response was authored / signed.
    pub responded_date: String,

    // Patient identification
    /// Patient name.
    pub patient_name: String,
    /// Patient NHS number.
    pub patient_nhs_number: String,
    /// Patient birth date.
    pub patient_birth_date: String,

    // Clinical assessment
    /// Narrative clinical summary of the assessment.
    pub clinical_summary: String,
    /// Cardiovascular examination findings.
    pub examination_findings: String,
    /// Investigations performed or reviewed and their findings.
    pub investigations_performed: String,

    // Structured findings
    /// Structured finding: ischaemia or coronary artery disease present.
    pub ischaemia_or_cad: bool,
    /// Structured finding: significant arrhythmia present.
    pub significant_arrhythmia: bool,
    /// Structured finding: reduced left-ventricular ejection fraction.
    pub reduced_ejection_fraction: bool,
    /// Structured finding: significant (moderate or severe) valve disease.
    pub significant_valve_disease: bool,
    /// Structured finding: structural cardiac abnormality.
    pub structural_abnormality: bool,
    /// Structured finding: uncontrolled hypertension.
    pub uncontrolled_hypertension: bool,
    /// Structured finding: a non-cardiac cause was identified or judged likely.
    pub non_cardiac_cause: bool,

    // Diagnosis
    /// Primary diagnosis category.
    pub primary_diagnosis_category: PrimaryDiagnosisCategory,
    /// Narrative diagnosis answering the referral clinical question.
    pub diagnosis_narrative: String,

    // Key measurement
    /// Left-ventricular ejection fraction as a percentage (0–100).
    pub lv_ejection_fraction_percent: Option<f64>,

    // Management and follow-up
    /// Management plan including investigations arranged and treatment.
    pub management_plan: String,
    /// Medication changes recommended or made.
    pub medication_changes: String,
    /// Recommended follow-up, including who should action it and when.
    pub recommended_follow_up: String,

    // Critical-result communication and sign-off
    /// Whether a critical or unexpected significant cardiac result is present.
    pub critical_result: bool,
    /// Whether the critical result was communicated directly to the referrer.
    pub critical_result_communicated: bool,
    /// Who the critical / urgent result was communicated to.
    pub reported_to: String,
    /// Free-text interpretation / sign-off notes.
    pub clinician_notes: String,
    /// Whether the response is signed.
    pub signed: bool,
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/// A single rule that fired during grading (audit trail).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Stable rule identifier (e.g. `R-CLASS-CRITICAL-01`).
    pub rule_id: String,
    /// Scoring axis the rule belongs to.
    pub axis: Axis,
    /// Category or finding the rule relates to.
    pub category: String,
    /// Human-readable description of why the rule fired.
    pub description: String,
}

/// A safety-critical flag, independent of the four axes.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Flag {
    /// Stable flag identifier (e.g. `F-CRITICAL-FINDING-001`).
    pub flag_id: String,
    /// Flag category.
    pub category: FlagCategory,
    /// Priority.
    pub priority: FlagPriority,
    /// Human-readable description of what fired the flag.
    pub description: String,
    /// Suggested clinical action.
    pub suggested_action: String,
}

/// The computed four-axis interpretation grade. Mirrors
/// `sql/05_create_table_cardiology_response_grade.sql`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Axis A — response classification.
    pub response_classification: ResponseClassification,
    /// Axis B — condition severity.
    pub severity: Severity,
    /// Axis B — structured-finding category label.
    pub severity_category: String,
    /// Axis C — response completeness percent (0–100).
    pub completeness_percent: i32,
    /// Axis D — follow-up urgency.
    pub follow_up_urgency: FollowUpUrgency,
    /// Axis D — target timeframe for the recommended follow-up.
    pub target_timeframe: String,
    /// Axis D — concise recommended action.
    pub recommended_action: String,
    /// Overall recommendation.
    pub recommendation: Recommendation,
    /// Fired-rule audit trail.
    pub fired_rules: Vec<FiredRule>,
    /// Safety flags.
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
    /// Patient name.
    pub patient_name: String,
    /// Consultation type.
    pub consultation_type: ConsultationType,
    /// Response status.
    pub response_status: ResponseStatus,
    /// Responded date.
    pub responded_date: String,
    /// Axis A classification.
    pub response_classification: ResponseClassification,
    /// Axis B severity.
    pub severity: Severity,
    /// Axis D follow-up urgency.
    pub follow_up_urgency: FollowUpUrgency,
    /// Axis C completeness percent.
    pub completeness_percent: i32,
    /// Number of flags raised.
    pub flag_count: usize,
}
