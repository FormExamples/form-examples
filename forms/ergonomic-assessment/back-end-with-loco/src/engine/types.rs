//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Risk level.
pub type RiskLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Assessor name.
    pub assessor_name: String,
    /// Referral reason.
    pub referral_reason: String,
}

// ─── Occupation Details (Step 2) ────────────────────────────

/// Occupation details.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OccupationDetails {
    /// Job title.
    pub job_title: String,
    /// Department.
    pub department: String,
    /// Employer.
    pub employer: String,
    /// Hours per week.
    pub hours_per_week: String,
    /// Shift pattern.
    pub shift_pattern: String,
    /// Years in role.
    pub years_in_role: String,
    /// Job description.
    pub job_description: String,
}

// ─── Workstation Assessment (Step 3) ────────────────────────

/// Workstation assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct WorkstationAssessment {
    /// Desk height appropriate.
    pub desk_height_appropriate: Option<u8>,
    /// Chair adjustability.
    pub chair_adjustability: Option<u8>,
    /// Monitor position.
    pub monitor_position: Option<u8>,
    /// Keyboard mouse placement.
    pub keyboard_mouse_placement: Option<u8>,
    /// Legroom adequate.
    pub legroom_adequate: Option<u8>,
    /// Desk surface area.
    pub desk_surface_area: Option<u8>,
    /// Workstation notes.
    pub workstation_notes: String,
}

// ─── Posture Assessment (Step 4) ────────────────────────────

/// Posture assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PostureAssessment {
    /// Neck posture.
    pub neck_posture: Option<u8>,
    /// Shoulder posture.
    pub shoulder_posture: Option<u8>,
    /// Upper back posture.
    pub upper_back_posture: Option<u8>,
    /// Lower back posture.
    pub lower_back_posture: Option<u8>,
    /// Wrist posture.
    pub wrist_posture: Option<u8>,
    /// Leg posture.
    pub leg_posture: Option<u8>,
    /// Rula score.
    pub rula_score: Option<u8>,
    /// Reba score.
    pub reba_score: Option<u8>,
}

// ─── Musculoskeletal Symptoms (Step 5) ──────────────────────

/// Musculoskeletal symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MusculoskeletalSymptoms {
    /// Neck pain.
    pub neck_pain: Option<u8>,
    /// Shoulder pain.
    pub shoulder_pain: Option<u8>,
    /// Upper back pain.
    pub upper_back_pain: Option<u8>,
    /// Lower back pain.
    pub lower_back_pain: Option<u8>,
    /// Wrist hand pain.
    pub wrist_hand_pain: Option<u8>,
    /// Elbow pain.
    pub elbow_pain: Option<u8>,
    /// Hip pain.
    pub hip_pain: Option<u8>,
    /// Knee pain.
    pub knee_pain: Option<u8>,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Symptom frequency.
    pub symptom_frequency: String,
    /// Pain body map notes.
    pub pain_body_map_notes: String,
}

// ─── Manual Handling (Step 6) ───────────────────────────────

/// Manual handling.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ManualHandling {
    /// Lifting required.
    pub lifting_required: String,
    /// Max lift weight kg.
    pub max_lift_weight_kg: String,
    /// Lifting frequency.
    pub lifting_frequency: String,
    /// Carrying distance.
    pub carrying_distance: String,
    /// Pushing pulling.
    pub pushing_pulling: String,
    /// Team lifting available.
    pub team_lifting_available: String,
    /// Manual handling training.
    pub manual_handling_training: String,
    /// Mechanical aids available.
    pub mechanical_aids_available: String,
}

// ─── DSE Assessment (Step 7) ────────────────────────────────

/// Dse assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DseAssessment {
    /// Screen flicker free.
    pub screen_flicker_free: String,
    /// Screen brightness adjustable.
    pub screen_brightness_adjustable: String,
    /// Screen glare free.
    pub screen_glare_free: String,
    /// Keyboard separate.
    pub keyboard_separate: String,
    /// Keyboard tiltable.
    pub keyboard_tiltable: String,
    /// Mouse comfortable.
    pub mouse_comfortable: String,
    /// Software suitable.
    pub software_suitable: String,
    /// Continuous dse hours.
    pub continuous_dse_hours: String,
    /// Eye test offered.
    pub eye_test_offered: String,
    /// Dse training completed.
    pub dse_training_completed: String,
}

// ─── Break Patterns (Step 8) ────────────────────────────────

/// Break patterns.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BreakPatterns {
    /// Break frequency.
    pub break_frequency: String,
    /// Break duration minutes.
    pub break_duration_minutes: String,
    /// Micro breaks taken.
    pub micro_breaks_taken: String,
    /// Stretching exercises.
    pub stretching_exercises: String,
    /// Task variety.
    pub task_variety: Option<u8>,
    /// Autonomy over breaks.
    pub autonomy_over_breaks: Option<u8>,
}

// ─── Environmental Factors (Step 9) ─────────────────────────

/// Environmental factors.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentalFactors {
    /// Lighting adequate.
    pub lighting_adequate: Option<u8>,
    /// Temperature comfortable.
    pub temperature_comfortable: Option<u8>,
    /// Noise level acceptable.
    pub noise_level_acceptable: Option<u8>,
    /// Ventilation adequate.
    pub ventilation_adequate: Option<u8>,
    /// Space sufficient.
    pub space_sufficient: Option<u8>,
    /// Floor surface safe.
    pub floor_surface_safe: Option<u8>,
    /// Environmental notes.
    pub environmental_notes: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Previous msd history.
    pub previous_msd_history: String,
    /// Current treatment.
    pub current_treatment: String,
    /// Medication for pain.
    pub medication_for_pain: String,
    /// Occupational health referral.
    pub occupational_health_referral: String,
    /// Recommended adjustments.
    pub recommended_adjustments: String,
    /// Follow up required.
    pub follow_up_required: String,
    /// Clinician comments.
    pub clinician_comments: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Occupation details.
    pub occupation_details: OccupationDetails,
    /// Workstation assessment.
    pub workstation_assessment: WorkstationAssessment,
    /// Posture assessment.
    pub posture_assessment: PostureAssessment,
    /// Musculoskeletal symptoms.
    pub musculoskeletal_symptoms: MusculoskeletalSymptoms,
    /// Manual handling.
    pub manual_handling: ManualHandling,
    /// Dse assessment.
    pub dse_assessment: DseAssessment,
    /// Break patterns.
    pub break_patterns: BreakPatterns,
    /// Environmental factors.
    pub environmental_factors: EnvironmentalFactors,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Concern level.
    pub concern_level: String,
}

/// Additional flag.
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

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Risk score.
    pub risk_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
