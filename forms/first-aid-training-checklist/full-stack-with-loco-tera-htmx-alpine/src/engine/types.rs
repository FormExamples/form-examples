use serde::{Deserialize, Serialize};

/// Tri-state checklist response:
/// - `"yes"` skill demonstrated correctly
/// - `"no"`  skill not yet demonstrated / failed
/// - `"na"`  item not assessed in this session
/// - `""`    examiner has not yet recorded an answer
pub type TriState = String;

/// Overall outcome: `"pass"` / `"needs-development"` / `"fail"` / `""`.
pub type Outcome = String;

/// Step 1 — Trainee Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TraineeDetails {
    pub first_name: String,
    pub last_name: String,
    pub trainee_id: String,
    /// e.g. `first-aider` / `workplace-first-aider` / `instructor-candidate` /
    /// `security-officer` / `lifeguard` / `teacher` / `volunteer` / `other` / `""`
    pub role: String,
    /// ISO date string or `""`.
    pub prior_certification_expiry: String,
    pub session_date: String,
    pub examiner_name: String,
    pub venue: String,
}

/// Step 2 — Scene Assessment & Safety.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SceneAssessmentSafety {
    pub scene_safe: TriState,
    pub ppe_applied: TriState,
    pub hazards_identified: TriState,
    pub bystanders_controlled: TriState,
}

/// Step 3 — Primary Survey (DRABC).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrimarySurveyDrabc {
    pub danger_check: TriState,
    pub response_check: TriState,
    pub airway_management: TriState,
    pub breathing_check: TriState,
    pub circulation_assessment: TriState,
    pub recovery_position_when_appropriate: TriState,
}

/// Step 4 — CPR & AED.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CprAed {
    pub effective_compressions: TriState,
    pub effective_ventilations: TriState,
    pub ratio30to2: TriState,
    pub aed_power_on_promptly: TriState,
    pub aed_pad_placement: TriState,
    pub aed_safe_shock_delivery: TriState,
}

/// Step 5 — Choking Management.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChokingManagement {
    pub encouraged_coughing: TriState,
    pub five_back_blows: TriState,
    pub five_abdominal_thrusts: TriState,
    pub alternates_until_dislodged: TriState,
    pub unconscious_choking_cpr: TriState,
}

/// Step 6 — Bleeding & Wound Care.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BleedingWoundCare {
    pub direct_pressure_applied: TriState,
    pub elevated_and_immobilised: TriState,
    pub applied_dressing_correctly: TriState,
    pub tourniquet_when_indicated: TriState,
    pub haemostatic_dressing_applied: TriState,
    pub treated_for_shock: TriState,
}

/// Step 7 — Burns & Scalds.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BurnsScalds {
    pub cooled_for_twenty_minutes: TriState,
    pub removed_jewellery_and_loose_clothing: TriState,
    pub covered_with_cling_film_or_sterile_dressing: TriState,
    pub avoided_creams_or_ice: TriState,
    pub referred_appropriately: TriState,
}

/// Step 8 — Fractures, Sprains & Spinal Injury.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FracturesSprainsSpinal {
    pub immobilised_injured_limb: TriState,
    pub applied_rice_for_sprains: TriState,
    pub suspected_spinal_manual_support: TriState,
    pub performed_log_roll_with_team: TriState,
    pub avoided_unnecessary_movement: TriState,
}

/// Step 9 — Medical Emergencies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalEmergencies {
    pub recognised_anaphylaxis: TriState,
    pub administered_epi_pen_safely: TriState,
    pub assisted_asthma_inhaler: TriState,
    pub managed_hypoglycaemia: TriState,
    pub managed_seizure_safely: TriState,
    #[serde(rename = "recognisedStrokeFAST")]
    pub recognised_stroke_fast: TriState,
    pub recognised_chest_pain: TriState,
}

/// Step 10 — Recording, Reporting & Handover.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordingReportingHandover {
    pub accident_book_entry: TriState,
    pub riddor_awareness: TriState,
    pub structured_handoff_sbar: TriState,
    pub confidentiality_maintained: TriState,
    pub examiner_notes: String,
    pub trainee_feedback: String,
    pub debrief_notes: String,
}

/// Full First Aid at Work competency assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub trainee_details: TraineeDetails,
    pub scene_assessment_safety: SceneAssessmentSafety,
    #[serde(rename = "primarySurveyDRABC")]
    pub primary_survey_drabc: PrimarySurveyDrabc,
    pub cpr_aed: CprAed,
    pub choking_management: ChokingManagement,
    pub bleeding_wound_care: BleedingWoundCare,
    pub burns_scalds: BurnsScalds,
    pub fractures_sprains_spinal: FracturesSprainsSpinal,
    pub medical_emergencies: MedicalEmergencies,
    pub recording_reporting_handover: RecordingReportingHandover,
}

/// A rule that was evaluated against the data (with its current status).
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

/// A flagged issue surfaced for examiner attention.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a First Aid at Work competency assessment.
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
