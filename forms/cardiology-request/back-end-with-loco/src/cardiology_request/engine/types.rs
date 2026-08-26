//! Core data types for the Cardiology Request four-axis vetting engine.
//!
//! These mirror `front-end-with-svelte/src/lib/engine/types.ts` exactly:
//! the field names are camelCase on the wire (`serde(rename_all = "camelCase")`)
//! and `snake_case` in the SQL columns. Enumerated values are kept as plain
//! `String`s so an empty string `''` represents an unanswered enum field, and
//! `Option<_>` represents an unanswered numeric / date field — matching the
//! monorepo convention.

use serde::{Deserialize, Serialize};

/// The cardiology referral / consult request — the source-of-truth record the
/// four-axis vetting grade is computed from. Mirrors
/// `sql/04_create_table_cardiology_request.sql`.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
#[derive(Default)]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
pub struct CardiologyRequest {
    // Referring clinician
    /// Referring clinician name.
    pub referring_clinician: String,
    /// Referrer role.
    pub referrer_role: String,
    /// Clinician registration body (GMC, NMC, HCPC, …).
    pub registration_body: String,
    /// Clinician registration number.
    pub registration_number: String,
    /// Supervising consultant name, if the referrer is in training.
    pub supervising_consultant: String,
    /// Referrer contact details for vetting queries.
    pub requester_contact: String,
    /// Date the referral was made (ISO-8601 date, or empty).
    pub referral_date: String,

    // Patient identification
    /// United Kingdom NHS number.
    pub nhs_number: String,
    /// Patient name.
    pub patient_name: String,
    /// Patient date of birth (ISO-8601 date, or empty).
    pub date_of_birth: String,

    // Referral lifecycle / setting
    /// Referral lifecycle status.
    pub status: String,
    /// Name of the referring site / practice / ward.
    pub site_name: String,
    /// Care setting the referral originates from.
    pub setting: String,
    /// Date by which the referrer requests the patient be seen.
    pub requested_by_date: String,

    // Requested service and reason
    /// Requested cardiology service.
    pub requested_service: String,
    /// Primary reason for referral.
    pub referral_reason: String,
    /// Specific clinical question the cardiology team is asked to answer.
    pub clinical_question: String,
    /// Relevant clinical history and context.
    pub relevant_history: String,

    // Symptoms
    /// Whether the patient has chest pain.
    pub symptom_chest_pain: bool,
    /// Character of chest pain per the angina typicality model.
    pub chest_pain_character: String,
    /// Whether the patient has breathlessness.
    pub symptom_breathlessness: bool,
    /// New York Heart Association functional class.
    pub nyha_class: String,
    /// Whether the patient has palpitations.
    pub symptom_palpitations: bool,
    /// Whether the patient has had syncope.
    pub symptom_syncope: bool,
    /// Whether the patient has peripheral oedema.
    pub symptom_oedema: bool,

    // Red flags / acuity
    /// Red flag: suspected acute coronary syndrome.
    pub suspected_acs: bool,
    /// Red flag: syncope on exertion.
    pub exertional_syncope: bool,
    /// Red flag: new-onset heart failure.
    pub new_onset_heart_failure: bool,

    // Investigations already performed
    /// Whether a resting ECG has been performed.
    pub ecg_done: bool,
    /// Resting ECG findings.
    pub ecg_findings: String,
    /// Troponin result status (elevated / normal / not-done).
    pub troponin_status: String,
    /// BNP / NT-proBNP result status (elevated / normal / not-done).
    pub bnp_status: String,

    // Cardiac history and risk factors
    /// History: known coronary artery disease.
    pub known_coronary_artery_disease: bool,
    /// History: previous myocardial infarction.
    pub previous_mi: bool,
    /// History: established heart failure.
    pub heart_failure: bool,
    /// History: known valve disease.
    pub valve_disease: bool,
    /// History: known arrhythmia.
    pub arrhythmia: bool,
    /// History: hypertension.
    pub hypertension: bool,
    /// History: diabetes mellitus.
    pub diabetes: bool,
    /// Current cardiac and other relevant medications.
    pub current_medications: String,

    // Triage
    /// Requested triage urgency.
    pub urgency: String,
    /// Free-text notes accompanying the referral.
    pub notes: String,
}


/// A single rule that fired during grading (audit trail). Mirrors
/// `sql/06_create_table_cardiology_request_grade_rule.sql`.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Stable rule identifier (e.g. `R-APPROP-MATCH-01`).
    pub rule_id: String,
    /// Scoring axis the rule belongs to.
    pub axis: String,
    /// Category or reason the rule relates to.
    pub category: String,
    /// Human-readable description of why the rule fired.
    pub description: String,
}

impl FiredRule {
    /// Construct a fired rule from string-likes.
    #[must_use]
    pub fn new(
        rule_id: &str,
        axis: &str,
        category: &str,
        description: &str,
    ) -> Self {
        Self {
            rule_id: rule_id.to_string(),
            axis: axis.to_string(),
            category: category.to_string(),
            description: description.to_string(),
        }
    }
}

/// A safety-critical flag, independent of the four axes. Mirrors
/// `sql/07_create_table_cardiology_request_grade_flag.sql`.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Flag {
    /// Stable flag identifier (e.g. `F-SUSPECTED-ACS-001`).
    pub flag_id: String,
    /// Flag category.
    pub category: String,
    /// Flag priority (`low` / `medium` / `high`).
    pub priority: String,
    /// Human-readable description of what fired the flag.
    pub description: String,
    /// Suggested clinical action.
    pub suggested_action: String,
}

/// The computed four-axis vetting grade. Mirrors
/// `sql/05_create_table_cardiology_request_grade.sql`.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Axis A — referral appropriateness.
    pub appropriateness_band: String,
    /// Axis B — safety / red-flag.
    pub safety_band: String,
    /// Axis C — request completeness (0–100, weighted).
    pub completeness_percent: i32,
    /// Axis D — triage priority.
    pub triage_tier: String,
    /// Target timeframe implied by the triage tier.
    pub target_timeframe: String,
    /// Overall vetting recommendation.
    pub recommendation: String,
    /// Audit trail of every rule that fired, in firing order.
    pub fired_rules: Vec<FiredRule>,
    /// Safety-critical flags, sorted high → medium → low.
    pub flags: Vec<Flag>,
    /// Timestamp when the engine computed the grade (ISO-8601).
    pub graded_at: String,
}
