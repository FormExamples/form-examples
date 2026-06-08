//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Function level.
pub type FunctionLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Gender.
    pub gender: String,
    /// Referral source.
    pub referral_source: String,
    /// Referral date.
    pub referral_date: String,
    /// Diagnosis.
    pub diagnosis: String,
    /// Therapist name.
    pub therapist_name: String,
    /// Assessment date.
    pub assessment_date: String,
}

// ─── Occupational Profile (Step 2) ──────────────────────────

/// Occupational profile.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalProfile {
    /// Living situation.
    pub living_situation: String,
    /// Primary roles.
    pub primary_roles: String,
    /// Prior functional level.
    pub prior_functional_level: String,
    /// Current concerns.
    pub current_concerns: String,
    /// Patient goals.
    pub patient_goals: String,
    /// Support system.
    pub support_system: String,
}

// ─── Daily Living Activities (Step 3) ───────────────────────

/// Daily living activities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DailyLivingActivities {
    /// Feeding.
    pub feeding: Option<u8>,
    /// Bathing.
    pub bathing: Option<u8>,
    /// Dressing upper.
    pub dressing_upper: Option<u8>,
    /// Dressing lower.
    pub dressing_lower: Option<u8>,
    /// Grooming.
    pub grooming: Option<u8>,
    /// Toileting.
    pub toileting: Option<u8>,
    /// Transfers.
    pub transfers: Option<u8>,
    /// Mobility.
    pub mobility: Option<u8>,
}

// ─── Instrumental Activities (Step 4) ───────────────────────

/// Instrumental activities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct InstrumentalActivities {
    /// Meal preparation.
    pub meal_preparation: Option<u8>,
    /// Household management.
    pub household_management: Option<u8>,
    /// Medication management.
    pub medication_management: Option<u8>,
    /// Financial management.
    pub financial_management: Option<u8>,
    /// Community mobility.
    pub community_mobility: Option<u8>,
    /// Shopping.
    pub shopping: Option<u8>,
    /// Telephone use.
    pub telephone_use: Option<u8>,
}

// ─── Cognitive & Perceptual (Step 5) ────────────────────────

/// Cognitive perceptual.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CognitivePerceptual {
    /// Orientation.
    pub orientation: Option<u8>,
    /// Attention.
    pub attention: Option<u8>,
    /// Memory.
    pub memory: Option<u8>,
    /// Problem solving.
    pub problem_solving: Option<u8>,
    /// Safety awareness.
    pub safety_awareness: Option<u8>,
    /// Visual perception.
    pub visual_perception: Option<u8>,
    /// Sequencing.
    pub sequencing: Option<u8>,
}

// ─── Motor & Sensory (Step 6) ───────────────────────────────

/// Motor sensory.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MotorSensory {
    /// Upper extremity strength.
    pub upper_extremity_strength: Option<u8>,
    /// Lower extremity strength.
    pub lower_extremity_strength: Option<u8>,
    /// Range of motion.
    pub range_of_motion: Option<u8>,
    /// Fine motor coordination.
    pub fine_motor_coordination: Option<u8>,
    /// Gross motor coordination.
    pub gross_motor_coordination: Option<u8>,
    /// Balance.
    pub balance: Option<u8>,
    /// Sensation.
    pub sensation: Option<u8>,
    /// Endurance.
    pub endurance: Option<u8>,
}

// ─── Home Environment (Step 7) ──────────────────────────────

/// Home environment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HomeEnvironment {
    /// Home accessibility.
    pub home_accessibility: Option<u8>,
    /// Bathroom safety.
    pub bathroom_safety: Option<u8>,
    /// Kitchen safety.
    pub kitchen_safety: Option<u8>,
    /// Fall risk factors.
    pub fall_risk_factors: Option<u8>,
    /// Adaptive equipment needs.
    pub adaptive_equipment_needs: String,
    /// Home modification needs.
    pub home_modification_needs: String,
}

// ─── Work & Leisure (Step 8) ────────────────────────────────

/// Work leisure.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct WorkLeisure {
    /// Employment status.
    pub employment_status: String,
    /// Work demands.
    pub work_demands: String,
    /// Return to work potential.
    pub return_to_work_potential: Option<u8>,
    /// Leisure participation.
    pub leisure_participation: Option<u8>,
    /// Social participation.
    pub social_participation: Option<u8>,
    /// Community integration.
    pub community_integration: Option<u8>,
}

// ─── Goals & Priorities (Step 9) ────────────────────────────

/// Goals priorities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GoalsPriorities {
    /// Short term goals.
    pub short_term_goals: String,
    /// Long term goals.
    pub long_term_goals: String,
    /// Patient priorities.
    pub patient_priorities: String,
    /// Caregiver concerns.
    pub caregiver_concerns: String,
    /// Barriers to participation.
    pub barriers_to_participation: String,
    /// Motivation level.
    pub motivation_level: Option<u8>,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Pain level.
    pub pain_level: Option<u8>,
    /// Fatigue level.
    pub fatigue_level: Option<u8>,
    /// Emotional status.
    pub emotional_status: Option<u8>,
    /// Skin integrity.
    pub skin_integrity: Option<u8>,
    /// Precautions.
    pub precautions: String,
    /// Additional notes.
    pub additional_notes: String,
    /// Recommended frequency.
    pub recommended_frequency: String,
    /// Recommended duration.
    pub recommended_duration: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Occupational profile.
    pub occupational_profile: OccupationalProfile,
    /// Daily living activities.
    pub daily_living_activities: DailyLivingActivities,
    /// Instrumental activities.
    pub instrumental_activities: InstrumentalActivities,
    /// Cognitive perceptual.
    pub cognitive_perceptual: CognitivePerceptual,
    /// Motor sensory.
    pub motor_sensory: MotorSensory,
    /// Home environment.
    pub home_environment: HomeEnvironment,
    /// Work leisure.
    pub work_leisure: WorkLeisure,
    /// Goals priorities.
    pub goals_priorities: GoalsPriorities,
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
    /// Function level.
    pub function_level: FunctionLevel,
    /// Function score.
    pub function_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
