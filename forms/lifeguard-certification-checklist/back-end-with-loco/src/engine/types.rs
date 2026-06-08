//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases mirroring the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
/// Tri state.
pub type TriState = String; // 'yes' | 'no' | 'na' | ''
/// Outcome.
pub type Outcome = String; // 'pass' | 'needs-development' | 'fail' | ''

/// Step 1 — Candidate Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateDetails {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Candidate ID.
    pub candidate_id: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Venue type.
    pub venue_type: String,
    /// Venue name.
    pub venue_name: String,
    /// Assessment type.
    pub assessment_type: String,
    /// Prior certification expiry.
    pub prior_certification_expiry: String,
    /// Session date.
    pub session_date: String,
    /// Examiner name.
    pub examiner_name: String,
    /// Examiner licence number.
    pub examiner_licence_number: String,
}

/// Step 2 — Physical Fitness & Swim Competency.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalFitnessSwim {
    /// Swim50m time seconds.
    pub swim50m_time_seconds: Option<f64>,
    /// Swim50m within time.
    pub swim50m_within_time: TriState,
    /// Surface dive depth metres.
    pub surface_dive_depth_metres: Option<f64>,
    /// Sustained surface dive.
    pub sustained_surface_dive: TriState,
    /// Swim200m time seconds.
    pub swim200m_time_seconds: Option<f64>,
    /// Swim200m mixed strokes.
    pub swim200m_mixed_strokes: TriState,
    /// Tread water two minutes.
    pub tread_water_two_minutes: TriState,
    /// Tow casualty50m.
    pub tow_casualty50m: TriState,
}

/// Step 3 — Supervision, Scanning & Zoning.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SupervisionScanningZoning {
    /// Understands zone of responsibility.
    pub understands_zone_of_responsibility: TriState,
    /// Effective scanning pattern.
    pub effective_scanning_pattern: TriState,
    /// Ten twenty scan rule.
    pub ten_twenty_scan_rule: TriState,
    /// Recognises distressed swimmer.
    pub recognises_distressed_swimmer: TriState,
    /// Appropriate rotation.
    pub appropriate_rotation: TriState,
    /// Uses whistle and signals.
    pub uses_whistle_and_signals: TriState,
}

/// Step 4 — Rescue Scenario, Conscious Casualty.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RescueConscious {
    /// Recognition and alert.
    pub recognition_and_alert: TriState,
    /// Entry without loss of sight.
    pub entry_without_loss_of_sight: TriState,
    /// Approach with floating aid.
    pub approach_with_floating_aid: TriState,
    /// Reassures casualty.
    pub reassures_casualty: TriState,
    /// Tow to safety.
    pub tow_to_safety: TriState,
    /// Extrication from water.
    pub extrication_from_water: TriState,
}

/// Step 5 — Rescue Scenario, Unconscious Casualty.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RescueUnconscious {
    /// Recognition and alert.
    pub recognition_and_alert: TriState,
    /// Safe entry and approach.
    pub safe_entry_and_approach: TriState,
    /// Airway management in water.
    pub airway_management_in_water: TriState,
    /// Effective tow to safety.
    pub effective_tow_to_safety: TriState,
    /// Safe extrication.
    pub safe_extrication: TriState,
    /// Handover handsignal.
    pub handover_handsignal: TriState,
}

/// Step 6 — Spinal Injury Management.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpinalInjuryManagement {
    /// Recognises mechanism.
    pub recognises_mechanism: TriState,
    /// Head splint hold.
    pub head_splint_hold: TriState,
    /// Maintains inline stabilisation.
    pub maintains_inline_stabilisation: TriState,
    /// Careful roll if needed.
    pub careful_roll_if_needed: TriState,
    /// Use of spineboard.
    pub use_of_spineboard: TriState,
    /// Secure casualty to board.
    pub secure_casualty_to_board: TriState,
}

/// Step 7 — CPR & AED.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CprAed {
    /// Compression rate.
    pub compression_rate: Option<f64>,
    /// Compression depth.
    pub compression_depth: Option<f64>,
    /// Effective compressions.
    pub effective_compressions: TriState,
    /// Effective ventilations.
    pub effective_ventilations: TriState,
    /// Time to first shock seconds.
    pub time_to_first_shock_seconds: Option<f64>,
    /// Aed delivered promptly.
    pub aed_delivered_promptly: TriState,
    /// Safe shock no unsafe contact.
    pub safe_shock_no_unsafe_contact: TriState,
    /// Continuous quality cpr.
    pub continuous_quality_cpr: TriState,
}

/// Step 8 — First Aid & Oxygen Therapy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FirstAidOxygen {
    /// Bleeding control.
    pub bleeding_control: TriState,
    /// Burns management.
    pub burns_management: TriState,
    /// Fracture immobilisation.
    pub fracture_immobilisation: TriState,
    /// Recovery position use.
    pub recovery_position_use: TriState,
    /// Oxygen therapy administration.
    pub oxygen_therapy_administration: TriState,
    /// Uses pocket mask or bvm.
    pub uses_pocket_mask_or_bvm: TriState,
}

/// Step 9 — Legal, Regulatory & Incident Reporting.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LegalRegulatoryIncident {
    /// Duty of care understood.
    pub duty_of_care_understood: TriState,
    /// Pswp knowledge.
    pub pswp_knowledge: TriState,
    /// Eap invocation.
    pub eap_invocation: TriState,
    /// Incident report completed.
    pub incident_report_completed: TriState,
    /// Riddor awareness.
    pub riddor_awareness: TriState,
    /// Safeguarding children adults.
    pub safeguarding_children_adults: TriState,
}

/// Step 10 — Overall Result, Feedback & Signoff.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallResultSignoff {
    /// Examiner outcome.
    pub examiner_outcome: Outcome,
    /// Strengths.
    pub strengths: String,
    /// Development areas.
    pub development_areas: String,
    /// Examiner notes.
    pub examiner_notes: String,
    /// Candidate feedback.
    pub candidate_feedback: String,
    /// Candidate acknowledged.
    pub candidate_acknowledged: TriState,
}

/// Full Lifeguard Certification Checklist assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Candidate details.
    pub candidate_details: CandidateDetails,
    /// Physical fitness swim.
    pub physical_fitness_swim: PhysicalFitnessSwim,
    /// Supervision scanning zoning.
    pub supervision_scanning_zoning: SupervisionScanningZoning,
    /// Rescue conscious.
    pub rescue_conscious: RescueConscious,
    /// Rescue unconscious.
    pub rescue_unconscious: RescueUnconscious,
    /// Spinal injury management.
    pub spinal_injury_management: SpinalInjuryManagement,
    /// Cpr aed.
    pub cpr_aed: CprAed,
    /// First aid oxygen.
    pub first_aid_oxygen: FirstAidOxygen,
    /// Legal regulatory incident.
    pub legal_regulatory_incident: LegalRegulatoryIncident,
    /// Overall result signoff.
    pub overall_result_signoff: OverallResultSignoff,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Step.
    pub step: u32,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Critical.
    pub critical: bool,
    /// Status.
    pub status: TriState,
}

/// A safety flag computed independently of pass/fail outcome.
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

/// Grading output for a lifeguard certification assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Outcome.
    pub outcome: Outcome,
    /// Critical failures.
    pub critical_failures: Vec<FiredRule>,
    /// Deficiencies.
    pub deficiencies: Vec<FiredRule>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Answered count.
    pub answered_count: u32,
    /// Total rules.
    pub total_rules: u32,
    /// Timestamp.
    pub timestamp: String,
}
