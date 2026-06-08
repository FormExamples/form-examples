//! Serde data types for the assessment payload and grading result.

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
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Trainee ID.
    pub trainee_id: String,
    /// e.g. `first-aider` / `workplace-first-aider` / `instructor-candidate` /
    /// `security-officer` / `lifeguard` / `teacher` / `volunteer` / `other` / `""`
    pub role: String,
    /// ISO date string or `""`.
    pub prior_certification_expiry: String,
    /// Session date.
    pub session_date: String,
    /// Examiner name.
    pub examiner_name: String,
    /// Venue.
    pub venue: String,
}

/// Step 2 — Scene Assessment & Safety.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SceneAssessmentSafety {
    /// Scene safe.
    pub scene_safe: TriState,
    /// Ppe applied.
    pub ppe_applied: TriState,
    /// Hazards identified.
    pub hazards_identified: TriState,
    /// Bystanders controlled.
    pub bystanders_controlled: TriState,
}

/// Step 3 — Primary Survey (DRABC).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrimarySurveyDrabc {
    /// Danger check.
    pub danger_check: TriState,
    /// Response check.
    pub response_check: TriState,
    /// Airway management.
    pub airway_management: TriState,
    /// Breathing check.
    pub breathing_check: TriState,
    /// Circulation assessment.
    pub circulation_assessment: TriState,
    /// Recovery position when appropriate.
    pub recovery_position_when_appropriate: TriState,
}

/// Step 4 — CPR & AED.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CprAed {
    /// Effective compressions.
    pub effective_compressions: TriState,
    /// Effective ventilations.
    pub effective_ventilations: TriState,
    /// Ratio30to2.
    pub ratio30to2: TriState,
    /// Aed power on promptly.
    pub aed_power_on_promptly: TriState,
    /// Aed pad placement.
    pub aed_pad_placement: TriState,
    /// Aed safe shock delivery.
    pub aed_safe_shock_delivery: TriState,
}

/// Step 5 — Choking Management.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChokingManagement {
    /// Encouraged coughing.
    pub encouraged_coughing: TriState,
    /// Five back blows.
    pub five_back_blows: TriState,
    /// Five abdominal thrusts.
    pub five_abdominal_thrusts: TriState,
    /// Alternates until dislodged.
    pub alternates_until_dislodged: TriState,
    /// Unconscious choking cpr.
    pub unconscious_choking_cpr: TriState,
}

/// Step 6 — Bleeding & Wound Care.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BleedingWoundCare {
    /// Direct pressure applied.
    pub direct_pressure_applied: TriState,
    /// Elevated and immobilised.
    pub elevated_and_immobilised: TriState,
    /// Applied dressing correctly.
    pub applied_dressing_correctly: TriState,
    /// Tourniquet when indicated.
    pub tourniquet_when_indicated: TriState,
    /// Haemostatic dressing applied.
    pub haemostatic_dressing_applied: TriState,
    /// Treated for shock.
    pub treated_for_shock: TriState,
}

/// Step 7 — Burns & Scalds.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BurnsScalds {
    /// Cooled for twenty minutes.
    pub cooled_for_twenty_minutes: TriState,
    /// Removed jewellery and loose clothing.
    pub removed_jewellery_and_loose_clothing: TriState,
    /// Covered with cling film or sterile dressing.
    pub covered_with_cling_film_or_sterile_dressing: TriState,
    /// Avoided creams or ice.
    pub avoided_creams_or_ice: TriState,
    /// Referred appropriately.
    pub referred_appropriately: TriState,
}

/// Step 8 — Fractures, Sprains & Spinal Injury.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FracturesSprainsSpinal {
    /// Immobilised injured limb.
    pub immobilised_injured_limb: TriState,
    /// Applied rice for sprains.
    pub applied_rice_for_sprains: TriState,
    /// Suspected spinal manual support.
    pub suspected_spinal_manual_support: TriState,
    /// Performed log roll with team.
    pub performed_log_roll_with_team: TriState,
    /// Avoided unnecessary movement.
    pub avoided_unnecessary_movement: TriState,
}

/// Step 9 — Medical Emergencies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalEmergencies {
    /// Recognised anaphylaxis.
    pub recognised_anaphylaxis: TriState,
    /// Administered epi pen safely.
    pub administered_epi_pen_safely: TriState,
    /// Assisted asthma inhaler.
    pub assisted_asthma_inhaler: TriState,
    /// Managed hypoglycaemia.
    pub managed_hypoglycaemia: TriState,
    /// Managed seizure safely.
    pub managed_seizure_safely: TriState,
    /// Recognised stroke fast.
    #[serde(rename = "recognisedStrokeFAST")]
    pub recognised_stroke_fast: TriState,
    /// Recognised chest pain.
    pub recognised_chest_pain: TriState,
}

/// Step 10 — Recording, Reporting & Handover.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordingReportingHandover {
    /// Accident book entry.
    pub accident_book_entry: TriState,
    /// Riddor awareness.
    pub riddor_awareness: TriState,
    /// Structured handoff sbar.
    pub structured_handoff_sbar: TriState,
    /// Confidentiality maintained.
    pub confidentiality_maintained: TriState,
    /// Examiner notes.
    pub examiner_notes: String,
    /// Trainee feedback.
    pub trainee_feedback: String,
    /// Debrief notes.
    pub debrief_notes: String,
}

/// Full First Aid at Work competency assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Trainee details.
    pub trainee_details: TraineeDetails,
    /// Scene assessment safety.
    pub scene_assessment_safety: SceneAssessmentSafety,
    /// Primary survey drabc.
    #[serde(rename = "primarySurveyDRABC")]
    pub primary_survey_drabc: PrimarySurveyDrabc,
    /// Cpr aed.
    pub cpr_aed: CprAed,
    /// Choking management.
    pub choking_management: ChokingManagement,
    /// Bleeding wound care.
    pub bleeding_wound_care: BleedingWoundCare,
    /// Burns scalds.
    pub burns_scalds: BurnsScalds,
    /// Fractures sprains spinal.
    pub fractures_sprains_spinal: FracturesSprainsSpinal,
    /// Medical emergencies.
    pub medical_emergencies: MedicalEmergencies,
    /// Recording reporting handover.
    pub recording_reporting_handover: RecordingReportingHandover,
}

/// A rule that was evaluated against the data (with its current status).
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

/// A flagged issue surfaced for examiner attention.
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

/// Grading output for a First Aid at Work competency assessment.
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
