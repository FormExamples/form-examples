use serde::{Deserialize, Serialize};

// Type aliases mirroring the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
pub type TriState = String; // 'yes' | 'no' | 'na' | ''
pub type Outcome = String; // 'pass' | 'needs-development' | 'fail' | ''

/// Step 1 — Candidate Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateDetails {
    pub first_name: String,
    pub last_name: String,
    pub candidate_id: String,
    pub date_of_birth: String,
    pub venue_type: String,
    pub venue_name: String,
    pub assessment_type: String,
    pub prior_certification_expiry: String,
    pub session_date: String,
    pub examiner_name: String,
    pub examiner_licence_number: String,
}

/// Step 2 — Physical Fitness & Swim Competency.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalFitnessSwim {
    pub swim50m_time_seconds: Option<f64>,
    pub swim50m_within_time: TriState,
    pub surface_dive_depth_metres: Option<f64>,
    pub sustained_surface_dive: TriState,
    pub swim200m_time_seconds: Option<f64>,
    pub swim200m_mixed_strokes: TriState,
    pub tread_water_two_minutes: TriState,
    pub tow_casualty50m: TriState,
}

/// Step 3 — Supervision, Scanning & Zoning.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SupervisionScanningZoning {
    pub understands_zone_of_responsibility: TriState,
    pub effective_scanning_pattern: TriState,
    pub ten_twenty_scan_rule: TriState,
    pub recognises_distressed_swimmer: TriState,
    pub appropriate_rotation: TriState,
    pub uses_whistle_and_signals: TriState,
}

/// Step 4 — Rescue Scenario, Conscious Casualty.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RescueConscious {
    pub recognition_and_alert: TriState,
    pub entry_without_loss_of_sight: TriState,
    pub approach_with_floating_aid: TriState,
    pub reassures_casualty: TriState,
    pub tow_to_safety: TriState,
    pub extrication_from_water: TriState,
}

/// Step 5 — Rescue Scenario, Unconscious Casualty.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RescueUnconscious {
    pub recognition_and_alert: TriState,
    pub safe_entry_and_approach: TriState,
    pub airway_management_in_water: TriState,
    pub effective_tow_to_safety: TriState,
    pub safe_extrication: TriState,
    pub handover_handsignal: TriState,
}

/// Step 6 — Spinal Injury Management.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpinalInjuryManagement {
    pub recognises_mechanism: TriState,
    pub head_splint_hold: TriState,
    pub maintains_inline_stabilisation: TriState,
    pub careful_roll_if_needed: TriState,
    pub use_of_spineboard: TriState,
    pub secure_casualty_to_board: TriState,
}

/// Step 7 — CPR & AED.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CprAed {
    pub compression_rate: Option<f64>,
    pub compression_depth: Option<f64>,
    pub effective_compressions: TriState,
    pub effective_ventilations: TriState,
    pub time_to_first_shock_seconds: Option<f64>,
    pub aed_delivered_promptly: TriState,
    pub safe_shock_no_unsafe_contact: TriState,
    pub continuous_quality_cpr: TriState,
}

/// Step 8 — First Aid & Oxygen Therapy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FirstAidOxygen {
    pub bleeding_control: TriState,
    pub burns_management: TriState,
    pub fracture_immobilisation: TriState,
    pub recovery_position_use: TriState,
    pub oxygen_therapy_administration: TriState,
    pub uses_pocket_mask_or_bvm: TriState,
}

/// Step 9 — Legal, Regulatory & Incident Reporting.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LegalRegulatoryIncident {
    pub duty_of_care_understood: TriState,
    pub pswp_knowledge: TriState,
    pub eap_invocation: TriState,
    pub incident_report_completed: TriState,
    pub riddor_awareness: TriState,
    pub safeguarding_children_adults: TriState,
}

/// Step 10 — Overall Result, Feedback & Signoff.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallResultSignoff {
    pub examiner_outcome: Outcome,
    pub strengths: String,
    pub development_areas: String,
    pub examiner_notes: String,
    pub candidate_feedback: String,
    pub candidate_acknowledged: TriState,
}

/// Full Lifeguard Certification Checklist assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub candidate_details: CandidateDetails,
    pub physical_fitness_swim: PhysicalFitnessSwim,
    pub supervision_scanning_zoning: SupervisionScanningZoning,
    pub rescue_conscious: RescueConscious,
    pub rescue_unconscious: RescueUnconscious,
    pub spinal_injury_management: SpinalInjuryManagement,
    pub cpr_aed: CprAed,
    pub first_aid_oxygen: FirstAidOxygen,
    pub legal_regulatory_incident: LegalRegulatoryIncident,
    pub overall_result_signoff: OverallResultSignoff,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub step: u32,
    pub category: String,
    pub description: String,
    pub critical: bool,
    pub status: TriState,
}

/// A safety flag computed independently of pass/fail outcome.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a lifeguard certification assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub outcome: Outcome,
    pub critical_failures: Vec<FiredRule>,
    pub deficiencies: Vec<FiredRule>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub answered_count: u32,
    pub total_rules: u32,
    pub timestamp: String,
}
