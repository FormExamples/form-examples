use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type ChecklistStatus = String;

/// Case identification fields (patient + clinicians + scheduling).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseDetails {
    // Patient identification (denormalized for the JSONB blob).
    pub patient_name: String,
    pub patient_date_of_birth: String,
    pub patient_sex: String,
    pub patient_nhs_number: String,
    pub patient_medical_record_number: String,
    pub patient_weight_as_kg: Option<f64>,

    // Lead clinicians (free-text in this single-table layout).
    pub surgeon_name: String,
    pub anaesthetist_name: String,
    pub lead_nurse_name: String,

    // Scheduling.
    pub site_name: String,
    pub operating_room: String,
    pub case_date: String,
    pub case_start_at: String,
    pub case_end_at: String,

    // Procedure.
    pub planned_procedure: String,
    pub surgical_specialty: String,
    pub urgency: String,
    pub laterality: String,
    pub is_paediatric: YesNo,

    // Lifecycle.
    pub abandoned_reason: String,
}

/// Phase 1 — Sign In (before induction of anaesthesia).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignIn {
    pub identity_site_procedure_consent: YesNo,
    pub site_marked: String,
    pub anaesthesia_check_complete: YesNo,
    pub pulse_oximeter_on_patient: YesNo,
    pub known_allergy: String,
    pub known_allergy_detail: String,
    pub difficult_airway_aspiration_risk: String,
    pub blood_loss_risk: String,
    pub coordinator_name: String,
    pub coordinator_role: String,
    pub completed_at: String,
}

/// Phase 2 — Time Out (before skin incision).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeOut {
    pub team_introductions_confirmed: YesNo,
    pub patient_procedure_incision_confirmed: YesNo,
    pub antibiotic_prophylaxis_within_60min: String,
    pub surgeon_critical_steps: String,
    pub surgeon_case_duration_minutes: Option<i32>,
    pub surgeon_anticipated_blood_loss_ml: Option<i32>,
    pub anaesthetist_patient_concerns: String,
    pub nursing_sterility_confirmed: YesNo,
    pub nursing_equipment_concerns: String,
    pub essential_imaging_displayed: String,
    pub coordinator_name: String,
    pub coordinator_role: String,
    pub completed_at: String,
}

/// Phase 3 — Sign Out (before patient leaves operating room).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOut {
    pub procedure_name_confirmed: YesNo,
    pub counts_confirmed: String,
    pub specimens_labelled: String,
    pub equipment_problems: String,
    pub recovery_concerns: String,
    pub coordinator_name: String,
    pub coordinator_role: String,
    pub completed_at: String,
}

/// Operating-team roster entry captured during Time Out introductions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamMember {
    pub name: String,
    pub role: String,
    pub introduced_during_time_out: YesNo,
    pub notes: String,
}

/// Full WHO Surgical Safety Checklist case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub case_details: CaseDetails,
    pub sign_in: SignIn,
    pub time_out: TimeOut,
    pub sign_out: SignOut,
    pub team_members: Vec<TeamMember>,
}

/// A rule that fired during grading (i.e. an item was unanswered when it
/// should have been answered).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub phase: String,
    pub category: String,
    pub description: String,
    pub severity: String,
}

/// A safety flag computed independently of completion (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Per-phase completion summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhaseProgress {
    pub phase: String,
    pub answered: u32,
    pub total: u32,
    pub percent: u32,
    pub signed_off: bool,
}

/// Grading output for a checklist case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub checklist_status: ChecklistStatus,
    pub sign_in_progress: PhaseProgress,
    pub time_out_progress: PhaseProgress,
    pub sign_out_progress: PhaseProgress,
    pub overall_percent: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
