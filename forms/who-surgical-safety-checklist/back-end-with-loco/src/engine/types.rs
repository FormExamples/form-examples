//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Checklist status.
pub type ChecklistStatus = String;

/// Case identification fields (patient + clinicians + scheduling).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseDetails {
    // Patient identification (denormalized for the JSONB blob).
    /// Patient name.
    pub patient_name: String,
    /// Patient date of birth.
    pub patient_date_of_birth: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Patient NHS number.
    pub patient_nhs_number: String,
    /// Patient medical record number.
    pub patient_medical_record_number: String,
    /// Patient weight as kg.
    pub patient_weight_as_kg: Option<f64>,

    // Lead clinicians (free-text in this single-table layout).
    /// Surgeon name.
    pub surgeon_name: String,
    /// Anaesthetist name.
    pub anaesthetist_name: String,
    /// Lead nurse name.
    pub lead_nurse_name: String,

    // Scheduling.
    /// Site name.
    pub site_name: String,
    /// Operating room.
    pub operating_room: String,
    /// Case date.
    pub case_date: String,
    /// Case start at.
    pub case_start_at: String,
    /// Case end at.
    pub case_end_at: String,

    // Procedure.
    /// Planned procedure.
    pub planned_procedure: String,
    /// Surgical specialty.
    pub surgical_specialty: String,
    /// Urgency.
    pub urgency: String,
    /// Laterality.
    pub laterality: String,
    /// Is paediatric.
    pub is_paediatric: YesNo,

    // Lifecycle.
    /// Abandoned reason.
    pub abandoned_reason: String,
}

/// Phase 1 — Sign In (before induction of anaesthesia).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignIn {
    /// Identity site procedure consent.
    pub identity_site_procedure_consent: YesNo,
    /// Site marked.
    pub site_marked: String,
    /// Anaesthesia check complete.
    pub anaesthesia_check_complete: YesNo,
    /// Pulse oximeter on patient.
    pub pulse_oximeter_on_patient: YesNo,
    /// Known allergy.
    pub known_allergy: String,
    /// Known allergy detail.
    pub known_allergy_detail: String,
    /// Difficult airway aspiration risk.
    pub difficult_airway_aspiration_risk: String,
    /// Blood loss risk.
    pub blood_loss_risk: String,
    /// Coordinator name.
    pub coordinator_name: String,
    /// Coordinator role.
    pub coordinator_role: String,
    /// Completed at.
    pub completed_at: String,
}

/// Phase 2 — Time Out (before skin incision).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeOut {
    /// Team introductions confirmed.
    pub team_introductions_confirmed: YesNo,
    /// Patient procedure incision confirmed.
    pub patient_procedure_incision_confirmed: YesNo,
    /// Antibiotic prophylaxis within 60min.
    pub antibiotic_prophylaxis_within_60min: String,
    /// Surgeon critical steps.
    pub surgeon_critical_steps: String,
    /// Surgeon case duration minutes.
    pub surgeon_case_duration_minutes: Option<i32>,
    /// Surgeon anticipated blood loss ml.
    pub surgeon_anticipated_blood_loss_ml: Option<i32>,
    /// Anaesthetist patient concerns.
    pub anaesthetist_patient_concerns: String,
    /// Nursing sterility confirmed.
    pub nursing_sterility_confirmed: YesNo,
    /// Nursing equipment concerns.
    pub nursing_equipment_concerns: String,
    /// Essential imaging displayed.
    pub essential_imaging_displayed: String,
    /// Coordinator name.
    pub coordinator_name: String,
    /// Coordinator role.
    pub coordinator_role: String,
    /// Completed at.
    pub completed_at: String,
}

/// Phase 3 — Sign Out (before patient leaves operating room).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOut {
    /// Procedure name confirmed.
    pub procedure_name_confirmed: YesNo,
    /// Counts confirmed.
    pub counts_confirmed: String,
    /// Specimens labelled.
    pub specimens_labelled: String,
    /// Equipment problems.
    pub equipment_problems: String,
    /// Recovery concerns.
    pub recovery_concerns: String,
    /// Coordinator name.
    pub coordinator_name: String,
    /// Coordinator role.
    pub coordinator_role: String,
    /// Completed at.
    pub completed_at: String,
}

/// Operating-team roster entry captured during Time Out introductions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamMember {
    /// Name.
    pub name: String,
    /// Role.
    pub role: String,
    /// Introduced during time out.
    pub introduced_during_time_out: YesNo,
    /// Notes.
    pub notes: String,
}

/// Full WHO Surgical Safety Checklist case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Case details.
    pub case_details: CaseDetails,
    /// Sign in.
    pub sign_in: SignIn,
    /// Time out.
    pub time_out: TimeOut,
    /// Sign out.
    pub sign_out: SignOut,
    /// Team members.
    pub team_members: Vec<TeamMember>,
}

/// A rule that fired during grading (i.e. an item was unanswered when it
/// should have been answered).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Phase.
    pub phase: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Severity.
    pub severity: String,
}

/// A safety flag computed independently of completion (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: String,
}

/// Per-phase completion summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhaseProgress {
    /// Phase.
    pub phase: String,
    /// Answered.
    pub answered: u32,
    /// Total.
    pub total: u32,
    /// Percent.
    pub percent: u32,
    /// Signed off.
    pub signed_off: bool,
}

/// Grading output for a checklist case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Checklist status.
    pub checklist_status: ChecklistStatus,
    /// Sign in progress.
    pub sign_in_progress: PhaseProgress,
    /// Time out progress.
    pub time_out_progress: PhaseProgress,
    /// Sign out progress.
    pub sign_out_progress: PhaseProgress,
    /// Overall percent.
    pub overall_percent: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
