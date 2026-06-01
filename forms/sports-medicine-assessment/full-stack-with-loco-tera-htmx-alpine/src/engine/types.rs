use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type Sex = String;
pub type ContactLevel = String;
pub type Clearance = String;

/// Demographics section.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub emergency_contact_name: String,
    pub emergency_contact_phone: String,
}

/// Sport and position details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SportPositionDetails {
    pub primary_sport: String,
    pub primary_position: String,
    pub contact_level: ContactLevel,
    pub secondary_sports: String,
    pub competitive_level: String,
    pub hours_per_week: Option<f64>,
    pub previous_clearance_issue: YesNo,
    pub previous_clearance_details: String,
}

/// Medical history (chronic illness, medications, allergies, asthma, etc.).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    pub chronic_illness: YesNo,
    pub chronic_illness_details: String,
    pub current_medications: YesNo,
    pub current_medication_details: String,
    pub allergies_known: YesNo,
    pub allergy_details: String,
    pub prior_surgery: YesNo,
    pub prior_surgery_details: String,
    pub hospitalised_last_year: YesNo,
    pub asthma_or_exercise_induced_bronchospasm: YesNo,
    pub diabetes: YesNo,
    pub sickle_cell_trait_or_disease: YesNo,
    pub heat_illness_history: YesNo,
    pub eating_disorder_history: YesNo,
}

/// Family history (SCD, inherited cardiac conditions).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FamilyHistory {
    pub sudden_cardiac_death_under_50: YesNo,
    pub sudden_cardiac_death_relation: String,
    pub hypertrophic_cardiomyopathy: YesNo,
    pub marfan_syndrome: YesNo,
    pub long_qt_syndrome: YesNo,
    pub arrhythmia_or_pacemaker: YesNo,
    pub unexplained_seizure_or_fainting: YesNo,
}

/// Menstrual history / RED-S screening (applicable to female athletes).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistoryReds {
    pub applicable: bool,
    pub age_at_menarche: Option<i32>,
    pub regular_periods: YesNo,
    pub amenorrhoea_six_months: YesNo,
    pub cycles_last_12_months: Option<i32>,
    pub restrictive_eating_pattern: YesNo,
    pub stress_fracture_history: YesNo,
    pub low_energy_availability_concern: YesNo,
}

/// Cardiovascular screening (14-point AHA).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularScreening {
    pub chest_pain_with_exertion: YesNo,
    pub unexplained_syncope: YesNo,
    pub excessive_breathlessness: YesNo,
    pub palpitations_or_irregular_beat: YesNo,
    pub high_blood_pressure_diagnosis: YesNo,
    pub heart_murmur_detected: YesNo,
    pub restricted_activity_for_heart: YesNo,
    pub resting_systolic: Option<i32>,
    pub resting_diastolic: Option<i32>,
    pub resting_heart_rate: Option<i32>,
}

/// Musculoskeletal screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MusculoskeletalScreening {
    pub uncorrected_major_injury: YesNo,
    pub major_injury_details: String,
    pub joint_instability: YesNo,
    pub joint_instability_details: String,
    pub ongoing_pain_or_swelling: YesNo,
    pub chronic_joint_disease: YesNo,
    pub use_brace_or_assistive_device: YesNo,
    pub full_range_of_motion: YesNo,
    pub normal_strength_bilateral: YesNo,
}

/// Neurological / concussion baseline (SCAT6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NeurologicalConcussionBaseline {
    pub total_concussions: Option<i32>,
    pub concussion_last_six_months: YesNo,
    pub most_recent_concussion_date: String,
    pub ongoing_post_concussive_symptoms: YesNo,
    pub history_of_seizures: YesNo,
    pub stinger: YesNo,
    pub history_of_head_or_neck_surgery: YesNo,
    pub baseline_headaches_or_migraine: YesNo,
}

/// Vision and skin section.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisionSkin {
    pub corrective_lenses_worn: YesNo,
    pub monocular_athlete: YesNo,
    pub protective_eyewear_available: YesNo,
    pub active_skin_infection: YesNo,
    pub active_skin_infection_details: String,
    pub herpes_gladiatorum: YesNo,
    pub impetigo_or_mrsa: YesNo,
    pub open_wounds_or_lesions: YesNo,
}

/// Clearance decision section.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClearanceDecision {
    pub preferred_clearance: Clearance,
    pub clearance_conditions: String,
    pub follow_up_required: String,
    pub clinician_name: String,
    pub clinician_signature_date: String,
    pub additional_notes: String,
}

/// Full Sports Medicine PPE assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub sport_position_details: SportPositionDetails,
    pub medical_history: MedicalHistory,
    pub family_history: FamilyHistory,
    pub menstrual_history_reds: MenstrualHistoryReds,
    pub cardiovascular_screening: CardiovascularScreening,
    pub musculoskeletal_screening: MusculoskeletalScreening,
    pub neurological_concussion_baseline: NeurologicalConcussionBaseline,
    pub vision_skin: VisionSkin,
    pub clearance_decision: ClearanceDecision,
}

/// A rule that fired during PPE grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    /// 1=info, 2=conditional, 3=pending, 4=not-cleared.
    pub grade: u8,
}

/// A clinician-facing additional flag (independent of the rule-driven decision).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading result for a PPE assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub clearance: Clearance,
    pub answered_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
