use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type YesNoUnknown = String;
pub type SupportLevel = String;
pub type SeverityCategory = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub nhs_number: String,
    pub gp_practice: String,
    pub preferred_name: String,
    pub ethnicity: String,
}

/// Step 2 — Carer & Support Network.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarerSupport {
    pub primary_carer_name: String,
    pub primary_carer_relationship: String,
    pub primary_carer_phone: String,
    pub lives_with_carer: YesNo,
    pub living_arrangement: String,
    pub has_support_plan: YesNo,
    pub has_social_worker: YesNo,
    pub social_worker_name: String,
    pub other_supports: String,
}

/// Step 3 — Communication Needs.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationNeeds {
    pub uses_easy_read: YesNo,
    pub uses_makaton: YesNo,
    pub uses_aac: YesNo,
    pub aac_details: String,
    pub uses_pictures: YesNo,
    pub needs_interpreter: YesNo,
    pub interpreter_language: String,
    pub verbal_ability: String,
    pub preferred_communication_method: String,
    pub communication_notes: String,
}

/// Step 4 — Medical Review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalReview {
    pub has_epilepsy: YesNo,
    pub last_seizure_date: String,
    pub seizures_per_month: Option<i32>,
    pub has_mental_health_diagnosis: YesNo,
    pub mental_health_details: String,
    pub takes_psychotropic: YesNo,
    pub stomp_review_done: YesNo,
    pub current_medications: String,
    pub has_dysphagia: YesNo,
    pub has_constipation: YesNo,
    pub has_incontinence: YesNo,
    pub has_sleep_problems: YesNo,
    pub other_medical_issues: String,
}

/// Step 5 — Physical Examination & Observations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub blood_pressure_systolic: Option<i32>,
    pub blood_pressure_diastolic: Option<i32>,
    pub pulse: Option<i32>,
    pub vision_checked: YesNoUnknown,
    pub vision_date: String,
    pub hearing_checked: YesNoUnknown,
    pub hearing_date: String,
    pub dental_checked: YesNoUnknown,
    pub dental_date: String,
    pub vaccinations_up_to_date: YesNoUnknown,
    pub cervical_screening: YesNoUnknown,
    pub breast_screening: YesNoUnknown,
    pub bowel_screening: YesNoUnknown,
}

/// Step 6 — Adaptive Functioning (10 items across 3 domains).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdaptiveFunctioning {
    pub conceptual_language: SupportLevel,
    pub conceptual_reading_writing: SupportLevel,
    pub conceptual_money_time: SupportLevel,
    pub social_friendships: SupportLevel,
    pub social_empathy: SupportLevel,
    pub social_communication: SupportLevel,
    pub practical_self_care: SupportLevel,
    pub practical_home_living: SupportLevel,
    pub practical_community: SupportLevel,
    pub practical_work_school: SupportLevel,
}

/// Step 7 — Behavioural Concerns & Triggers.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BehaviouralConcerns {
    pub self_injurious: YesNo,
    pub aggression: YesNo,
    pub property_damage: YesNo,
    pub absconding: YesNo,
    pub sexualised_behaviour: YesNo,
    pub known_triggers: String,
    pub calming_strategies: String,
    pub has_behaviour_support_plan: YesNo,
    pub uses_prn: YesNo,
    pub prn_details: String,
}

/// Step 8 — Mental Capacity & Consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalCapacityConsent {
    pub can_consent_to_health_check: YesNoUnknown,
    pub can_consent_to_medication: YesNoUnknown,
    pub can_consent_to_finances: YesNoUnknown,
    pub has_lpa: YesNo,
    pub lpa_details: String,
    pub has_dols: YesNo,
    pub best_interests_required: YesNo,
    pub best_interests_notes: String,
}

/// Step 9 — Reasonable Adjustments Required.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonableAdjustments {
    pub needs_longer_appointments: YesNo,
    pub needs_quiet_room: YesNo,
    pub needs_familiar_staff: YesNo,
    pub needs_easy_read_letters: YesNo,
    pub needs_home_visits: YesNo,
    pub needs_double_appointment: YesNo,
    pub flag_on_record: YesNo,
    pub other_adjustments: String,
}

/// Single action row in the Health Action Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthActionItem {
    pub action: String,
    pub owner: String,
    pub due_date: String,
}

/// Step 10 — Health Action Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthActionPlan {
    pub actions: Vec<HealthActionItem>,
    pub next_review_date: String,
    pub shared_with: String,
    pub plan_notes: String,
}

/// Full Learning Disability Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub carer_support: CarerSupport,
    pub communication_needs: CommunicationNeeds,
    pub medical_review: MedicalReview,
    pub physical_examination: PhysicalExamination,
    pub adaptive_functioning: AdaptiveFunctioning,
    pub behavioural_concerns: BehaviouralConcerns,
    pub mental_capacity_consent: MentalCapacityConsent,
    pub reasonable_adjustments: ReasonableAdjustments,
    pub health_action_plan: HealthActionPlan,
}

/// A rule that fired during grading — one adaptive-functioning item answered.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
}

/// Clinician-facing safety / hygiene flag, sorted by priority.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a Learning Disability assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub adaptive_score: f64,
    pub severity_category: SeverityCategory,
    pub answered_count: i32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
