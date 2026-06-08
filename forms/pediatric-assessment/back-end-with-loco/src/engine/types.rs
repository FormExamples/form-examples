//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Concern level.
pub type ConcernLevel = String;

// ─── Patient & Parent Information (Step 1) ──────────────────

/// Patient parent information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientParentInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Age months.
    pub age_months: String,
    /// Sex.
    pub sex: String,
    /// Parent guardian name.
    pub parent_guardian_name: String,
    /// Relationship.
    pub relationship: String,
    /// Phone number.
    pub phone_number: String,
    /// Pediatrician name.
    pub pediatrician_name: String,
}

// ─── Birth & Neonatal History (Step 2) ──────────────────────

/// Birth neonatal history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BirthNeonatalHistory {
    /// Gestational age weeks.
    pub gestational_age_weeks: Option<u8>,
    /// Birth weight grams.
    pub birth_weight_grams: Option<u16>,
    /// Delivery type.
    pub delivery_type: String,
    /// Birth complications.
    pub birth_complications: String,
    /// Nicu admission.
    pub nicu_admission: String,
    /// Nicu duration days.
    pub nicu_duration_days: String,
    /// Apgar score 1min.
    pub apgar_score_1min: Option<u8>,
    /// Apgar score 5min.
    pub apgar_score_5min: Option<u8>,
}

// ─── Growth & Development (Step 3) ──────────────────────────

/// Growth development.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GrowthDevelopment {
    /// Weight percentile.
    pub weight_percentile: Option<u8>,
    /// Height percentile.
    pub height_percentile: Option<u8>,
    /// Head circumference percentile.
    pub head_circumference_percentile: Option<u8>,
    /// Growth trend.
    pub growth_trend: String,
    /// Weight for length.
    pub weight_for_length: Option<u8>,
    /// BMI percentile.
    pub bmi_percentile: Option<u8>,
}

// ─── Immunization Status (Step 4) ───────────────────────────

/// Immunization status.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ImmunizationStatus {
    /// Immunizations up to date.
    pub immunizations_up_to_date: String,
    /// Missing vaccines.
    pub missing_vaccines: String,
    /// Vaccine refusal.
    pub vaccine_refusal: String,
    /// Vaccine refusal reason.
    pub vaccine_refusal_reason: String,
    /// Last flu vaccine.
    pub last_flu_vaccine: String,
    /// Adverse reactions.
    pub adverse_reactions: String,
}

// ─── Feeding & Nutrition (Step 5) ───────────────────────────

/// Feeding nutrition.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FeedingNutrition {
    /// Feeding type.
    pub feeding_type: String,
    /// Feeding difficulty.
    pub feeding_difficulty: String,
    /// Diet variety.
    pub diet_variety: Option<u8>,
    /// Daily milk intake.
    pub daily_milk_intake: String,
    /// Vitamin supplementation.
    pub vitamin_supplementation: String,
    /// Food allergies.
    pub food_allergies: String,
    /// Appetite concern.
    pub appetite_concern: Option<u8>,
}

// ─── Developmental Milestones (Step 6) ──────────────────────

/// Developmental milestones.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DevelopmentalMilestones {
    /// Gross motor.
    pub gross_motor: Option<u8>,
    /// Fine motor.
    pub fine_motor: Option<u8>,
    /// Language expressive.
    pub language_expressive: Option<u8>,
    /// Language receptive.
    pub language_receptive: Option<u8>,
    /// Social emotional.
    pub social_emotional: Option<u8>,
    /// Cognitive.
    pub cognitive: Option<u8>,
    /// Self care.
    pub self_care: Option<u8>,
}

// ─── Behavioral Assessment (Step 7) ─────────────────────────

/// Behavioral assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BehavioralAssessment {
    /// Sleep quality.
    pub sleep_quality: Option<u8>,
    /// Sleep hours.
    pub sleep_hours: String,
    /// Tantrums frequency.
    pub tantrums_frequency: Option<u8>,
    /// Screen time hours.
    pub screen_time_hours: String,
    /// Social interaction.
    pub social_interaction: Option<u8>,
    /// Attention span.
    pub attention_span: Option<u8>,
    /// Anxiety level.
    pub anxiety_level: Option<u8>,
}

// ─── Family & Social History (Step 8) ───────────────────────

/// Family social history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FamilySocialHistory {
    /// Family chronic conditions.
    pub family_chronic_conditions: String,
    /// Family mental health.
    pub family_mental_health: String,
    /// Household size.
    pub household_size: String,
    /// Daycare school.
    pub daycare_school: String,
    /// Secondhand smoke.
    pub secondhand_smoke: String,
    /// Home safety.
    pub home_safety: Option<u8>,
    /// Parental stress.
    pub parental_stress: Option<u8>,
}

// ─── Systems Review (Step 9) ────────────────────────────────

/// Systems review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SystemsReview {
    /// Respiratory concerns.
    pub respiratory_concerns: Option<u8>,
    /// Gastrointestinal concerns.
    pub gastrointestinal_concerns: Option<u8>,
    /// Skin concerns.
    pub skin_concerns: Option<u8>,
    /// Musculoskeletal concerns.
    pub musculoskeletal_concerns: Option<u8>,
    /// Neurological concerns.
    pub neurological_concerns: Option<u8>,
    /// Ent concerns.
    pub ent_concerns: Option<u8>,
    /// Urinary concerns.
    pub urinary_concerns: Option<u8>,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall health impression.
    pub overall_health_impression: Option<u8>,
    /// Current medications.
    pub current_medications: String,
    /// Known allergies.
    pub known_allergies: String,
    /// Recent hospitalizations.
    pub recent_hospitalizations: String,
    /// Specialist referrals needed.
    pub specialist_referrals_needed: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient parent information.
    pub patient_parent_information: PatientParentInformation,
    /// Birth neonatal history.
    pub birth_neonatal_history: BirthNeonatalHistory,
    /// Growth development.
    pub growth_development: GrowthDevelopment,
    /// Immunization status.
    pub immunization_status: ImmunizationStatus,
    /// Feeding nutrition.
    pub feeding_nutrition: FeedingNutrition,
    /// Developmental milestones.
    pub developmental_milestones: DevelopmentalMilestones,
    /// Behavioral assessment.
    pub behavioral_assessment: BehavioralAssessment,
    /// Family social history.
    pub family_social_history: FamilySocialHistory,
    /// Systems review.
    pub systems_review: SystemsReview,
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
    /// Concern level.
    pub concern_level: ConcernLevel,
    /// Concern score.
    pub concern_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
