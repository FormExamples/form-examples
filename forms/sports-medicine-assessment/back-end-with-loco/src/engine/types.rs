//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Sex.
pub type Sex = String;
/// Contact level.
pub type ContactLevel = String;
/// Clearance.
pub type Clearance = String;

/// Demographics section.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Emergency contact name.
    pub emergency_contact_name: String,
    /// Emergency contact phone.
    pub emergency_contact_phone: String,
}

/// Sport and position details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SportPositionDetails {
    /// Primary sport.
    pub primary_sport: String,
    /// Primary position.
    pub primary_position: String,
    /// Contact level.
    pub contact_level: ContactLevel,
    /// Secondary sports.
    pub secondary_sports: String,
    /// Competitive level.
    pub competitive_level: String,
    /// Hours per week.
    pub hours_per_week: Option<f64>,
    /// Previous clearance issue.
    pub previous_clearance_issue: YesNo,
    /// Previous clearance details.
    pub previous_clearance_details: String,
}

/// Medical history (chronic illness, medications, allergies, asthma, etc.).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Chronic illness.
    pub chronic_illness: YesNo,
    /// Chronic illness details.
    pub chronic_illness_details: String,
    /// Current medications.
    pub current_medications: YesNo,
    /// Current medication details.
    pub current_medication_details: String,
    /// Allergies known.
    pub allergies_known: YesNo,
    /// Allergy details.
    pub allergy_details: String,
    /// Prior surgery.
    pub prior_surgery: YesNo,
    /// Prior surgery details.
    pub prior_surgery_details: String,
    /// Hospitalised last year.
    pub hospitalised_last_year: YesNo,
    /// Asthma or exercise induced bronchospasm.
    pub asthma_or_exercise_induced_bronchospasm: YesNo,
    /// Diabetes.
    pub diabetes: YesNo,
    /// Sickle cell trait or disease.
    pub sickle_cell_trait_or_disease: YesNo,
    /// Heat illness history.
    pub heat_illness_history: YesNo,
    /// Eating disorder history.
    pub eating_disorder_history: YesNo,
}

/// Family history (SCD, inherited cardiac conditions).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FamilyHistory {
    /// Sudden cardiac death under 50.
    pub sudden_cardiac_death_under_50: YesNo,
    /// Sudden cardiac death relation.
    pub sudden_cardiac_death_relation: String,
    /// Hypertrophic cardiomyopathy.
    pub hypertrophic_cardiomyopathy: YesNo,
    /// Marfan syndrome.
    pub marfan_syndrome: YesNo,
    /// Long qt syndrome.
    pub long_qt_syndrome: YesNo,
    /// Arrhythmia or pacemaker.
    pub arrhythmia_or_pacemaker: YesNo,
    /// Unexplained seizure or fainting.
    pub unexplained_seizure_or_fainting: YesNo,
}

/// Menstrual history / RED-S screening (applicable to female athletes).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistoryReds {
    /// Applicable.
    pub applicable: bool,
    /// Age at menarche.
    pub age_at_menarche: Option<i32>,
    /// Regular periods.
    pub regular_periods: YesNo,
    /// Amenorrhoea six months.
    pub amenorrhoea_six_months: YesNo,
    /// Cycles last 12 months.
    pub cycles_last_12_months: Option<i32>,
    /// Restrictive eating pattern.
    pub restrictive_eating_pattern: YesNo,
    /// Stress fracture history.
    pub stress_fracture_history: YesNo,
    /// Low energy availability concern.
    pub low_energy_availability_concern: YesNo,
}

/// Cardiovascular screening (14-point AHA).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularScreening {
    /// Chest pain with exertion.
    pub chest_pain_with_exertion: YesNo,
    /// Unexplained syncope.
    pub unexplained_syncope: YesNo,
    /// Excessive breathlessness.
    pub excessive_breathlessness: YesNo,
    /// Palpitations or irregular beat.
    pub palpitations_or_irregular_beat: YesNo,
    /// High blood pressure diagnosis.
    pub high_blood_pressure_diagnosis: YesNo,
    /// Heart murmur detected.
    pub heart_murmur_detected: YesNo,
    /// Restricted activity for heart.
    pub restricted_activity_for_heart: YesNo,
    /// Resting systolic.
    pub resting_systolic: Option<i32>,
    /// Resting diastolic.
    pub resting_diastolic: Option<i32>,
    /// Resting heart rate.
    pub resting_heart_rate: Option<i32>,
}

/// Musculoskeletal screening.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MusculoskeletalScreening {
    /// Uncorrected major injury.
    pub uncorrected_major_injury: YesNo,
    /// Major injury details.
    pub major_injury_details: String,
    /// Joint instability.
    pub joint_instability: YesNo,
    /// Joint instability details.
    pub joint_instability_details: String,
    /// Ongoing pain or swelling.
    pub ongoing_pain_or_swelling: YesNo,
    /// Chronic joint disease.
    pub chronic_joint_disease: YesNo,
    /// Use brace or assistive device.
    pub use_brace_or_assistive_device: YesNo,
    /// Full range of motion.
    pub full_range_of_motion: YesNo,
    /// Normal strength bilateral.
    pub normal_strength_bilateral: YesNo,
}

/// Neurological / concussion baseline (SCAT6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NeurologicalConcussionBaseline {
    /// Total concussions.
    pub total_concussions: Option<i32>,
    /// Concussion last six months.
    pub concussion_last_six_months: YesNo,
    /// Most recent concussion date.
    pub most_recent_concussion_date: String,
    /// Ongoing post concussive symptoms.
    pub ongoing_post_concussive_symptoms: YesNo,
    /// History of seizures.
    pub history_of_seizures: YesNo,
    /// Stinger.
    pub stinger: YesNo,
    /// History of head or neck surgery.
    pub history_of_head_or_neck_surgery: YesNo,
    /// Baseline headaches or migraine.
    pub baseline_headaches_or_migraine: YesNo,
}

/// Vision and skin section.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisionSkin {
    /// Corrective lenses worn.
    pub corrective_lenses_worn: YesNo,
    /// Monocular athlete.
    pub monocular_athlete: YesNo,
    /// Protective eyewear available.
    pub protective_eyewear_available: YesNo,
    /// Active skin infection.
    pub active_skin_infection: YesNo,
    /// Active skin infection details.
    pub active_skin_infection_details: String,
    /// Herpes gladiatorum.
    pub herpes_gladiatorum: YesNo,
    /// Impetigo or mrsa.
    pub impetigo_or_mrsa: YesNo,
    /// Open wounds or lesions.
    pub open_wounds_or_lesions: YesNo,
}

/// Clearance decision section.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClearanceDecision {
    /// Preferred clearance.
    pub preferred_clearance: Clearance,
    /// Clearance conditions.
    pub clearance_conditions: String,
    /// Follow up required.
    pub follow_up_required: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician signature date.
    pub clinician_signature_date: String,
    /// Additional notes.
    pub additional_notes: String,
}

/// Full Sports Medicine PPE assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Sport position details.
    pub sport_position_details: SportPositionDetails,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Family history.
    pub family_history: FamilyHistory,
    /// Menstrual history reds.
    pub menstrual_history_reds: MenstrualHistoryReds,
    /// Cardiovascular screening.
    pub cardiovascular_screening: CardiovascularScreening,
    /// Musculoskeletal screening.
    pub musculoskeletal_screening: MusculoskeletalScreening,
    /// Neurological concussion baseline.
    pub neurological_concussion_baseline: NeurologicalConcussionBaseline,
    /// Vision skin.
    pub vision_skin: VisionSkin,
    /// Clearance decision.
    pub clearance_decision: ClearanceDecision,
}

/// A rule that fired during PPE grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// 1=info, 2=conditional, 3=pending, 4=not-cleared.
    pub grade: u8,
}

/// A clinician-facing additional flag (independent of the rule-driven decision).
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

/// Grading result for a PPE assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Clearance.
    pub clearance: Clearance,
    /// Answered count.
    pub answered_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
