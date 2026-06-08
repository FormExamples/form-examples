//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Yes no unknown.
pub type YesNoUnknown = String;
/// Support level.
pub type SupportLevel = String;
/// Severity category.
pub type SeverityCategory = String;

/// Step 1 — Demographics.
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
    pub sex: String,
    /// NHS number.
    pub nhs_number: String,
    /// GP practice.
    pub gp_practice: String,
    /// Preferred name.
    pub preferred_name: String,
    /// Ethnicity.
    pub ethnicity: String,
}

/// Step 2 — Carer & Support Network.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarerSupport {
    /// Primary carer name.
    pub primary_carer_name: String,
    /// Primary carer relationship.
    pub primary_carer_relationship: String,
    /// Primary carer phone.
    pub primary_carer_phone: String,
    /// Lives with carer.
    pub lives_with_carer: YesNo,
    /// Living arrangement.
    pub living_arrangement: String,
    /// Has support plan.
    pub has_support_plan: YesNo,
    /// Has social worker.
    pub has_social_worker: YesNo,
    /// Social worker name.
    pub social_worker_name: String,
    /// Other supports.
    pub other_supports: String,
}

/// Step 3 — Communication Needs.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationNeeds {
    /// Uses easy read.
    pub uses_easy_read: YesNo,
    /// Uses makaton.
    pub uses_makaton: YesNo,
    /// Uses aac.
    pub uses_aac: YesNo,
    /// Aac details.
    pub aac_details: String,
    /// Uses pictures.
    pub uses_pictures: YesNo,
    /// Needs interpreter.
    pub needs_interpreter: YesNo,
    /// Interpreter language.
    pub interpreter_language: String,
    /// Verbal ability.
    pub verbal_ability: String,
    /// Preferred communication method.
    pub preferred_communication_method: String,
    /// Communication notes.
    pub communication_notes: String,
}

/// Step 4 — Medical Review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalReview {
    /// Has epilepsy.
    pub has_epilepsy: YesNo,
    /// Last seizure date.
    pub last_seizure_date: String,
    /// Seizures per month.
    pub seizures_per_month: Option<i32>,
    /// Has mental health diagnosis.
    pub has_mental_health_diagnosis: YesNo,
    /// Mental health details.
    pub mental_health_details: String,
    /// Takes psychotropic.
    pub takes_psychotropic: YesNo,
    /// Stomp review done.
    pub stomp_review_done: YesNo,
    /// Current medications.
    pub current_medications: String,
    /// Has dysphagia.
    pub has_dysphagia: YesNo,
    /// Has constipation.
    pub has_constipation: YesNo,
    /// Has incontinence.
    pub has_incontinence: YesNo,
    /// Has sleep problems.
    pub has_sleep_problems: YesNo,
    /// Other medical issues.
    pub other_medical_issues: String,
}

/// Step 5 — Physical Examination & Observations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Blood pressure systolic.
    pub blood_pressure_systolic: Option<i32>,
    /// Blood pressure diastolic.
    pub blood_pressure_diastolic: Option<i32>,
    /// Pulse.
    pub pulse: Option<i32>,
    /// Vision checked.
    pub vision_checked: YesNoUnknown,
    /// Vision date.
    pub vision_date: String,
    /// Hearing checked.
    pub hearing_checked: YesNoUnknown,
    /// Hearing date.
    pub hearing_date: String,
    /// Dental checked.
    pub dental_checked: YesNoUnknown,
    /// Dental date.
    pub dental_date: String,
    /// Vaccinations up to date.
    pub vaccinations_up_to_date: YesNoUnknown,
    /// Cervical screening.
    pub cervical_screening: YesNoUnknown,
    /// Breast screening.
    pub breast_screening: YesNoUnknown,
    /// Bowel screening.
    pub bowel_screening: YesNoUnknown,
}

/// Step 6 — Adaptive Functioning (10 items across 3 domains).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdaptiveFunctioning {
    /// Conceptual language.
    pub conceptual_language: SupportLevel,
    /// Conceptual reading writing.
    pub conceptual_reading_writing: SupportLevel,
    /// Conceptual money time.
    pub conceptual_money_time: SupportLevel,
    /// Social friendships.
    pub social_friendships: SupportLevel,
    /// Social empathy.
    pub social_empathy: SupportLevel,
    /// Social communication.
    pub social_communication: SupportLevel,
    /// Practical self care.
    pub practical_self_care: SupportLevel,
    /// Practical home living.
    pub practical_home_living: SupportLevel,
    /// Practical community.
    pub practical_community: SupportLevel,
    /// Practical work school.
    pub practical_work_school: SupportLevel,
}

/// Step 7 — Behavioural Concerns & Triggers.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BehaviouralConcerns {
    /// Self injurious.
    pub self_injurious: YesNo,
    /// Aggression.
    pub aggression: YesNo,
    /// Property damage.
    pub property_damage: YesNo,
    /// Absconding.
    pub absconding: YesNo,
    /// Sexualised behaviour.
    pub sexualised_behaviour: YesNo,
    /// Known triggers.
    pub known_triggers: String,
    /// Calming strategies.
    pub calming_strategies: String,
    /// Has behaviour support plan.
    pub has_behaviour_support_plan: YesNo,
    /// Uses prn.
    pub uses_prn: YesNo,
    /// Prn details.
    pub prn_details: String,
}

/// Step 8 — Mental Capacity & Consent.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalCapacityConsent {
    /// Can consent to health check.
    pub can_consent_to_health_check: YesNoUnknown,
    /// Can consent to medication.
    pub can_consent_to_medication: YesNoUnknown,
    /// Can consent to finances.
    pub can_consent_to_finances: YesNoUnknown,
    /// Has LPA.
    pub has_lpa: YesNo,
    /// LPA details.
    pub lpa_details: String,
    /// Has dols.
    pub has_dols: YesNo,
    /// Best interests required.
    pub best_interests_required: YesNo,
    /// Best interests notes.
    pub best_interests_notes: String,
}

/// Step 9 — Reasonable Adjustments Required.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReasonableAdjustments {
    /// Needs longer appointments.
    pub needs_longer_appointments: YesNo,
    /// Needs quiet room.
    pub needs_quiet_room: YesNo,
    /// Needs familiar staff.
    pub needs_familiar_staff: YesNo,
    /// Needs easy read letters.
    pub needs_easy_read_letters: YesNo,
    /// Needs home visits.
    pub needs_home_visits: YesNo,
    /// Needs double appointment.
    pub needs_double_appointment: YesNo,
    /// Flag on record.
    pub flag_on_record: YesNo,
    /// Other adjustments.
    pub other_adjustments: String,
}

/// Single action row in the Health Action Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthActionItem {
    /// Action.
    pub action: String,
    /// Owner.
    pub owner: String,
    /// Due date.
    pub due_date: String,
}

/// Step 10 — Health Action Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthActionPlan {
    /// Actions.
    pub actions: Vec<HealthActionItem>,
    /// Next review date.
    pub next_review_date: String,
    /// Shared with.
    pub shared_with: String,
    /// Plan notes.
    pub plan_notes: String,
}

/// Full Learning Disability Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Carer support.
    pub carer_support: CarerSupport,
    /// Communication needs.
    pub communication_needs: CommunicationNeeds,
    /// Medical review.
    pub medical_review: MedicalReview,
    /// Physical examination.
    pub physical_examination: PhysicalExamination,
    /// Adaptive functioning.
    pub adaptive_functioning: AdaptiveFunctioning,
    /// Behavioural concerns.
    pub behavioural_concerns: BehaviouralConcerns,
    /// Mental capacity consent.
    pub mental_capacity_consent: MentalCapacityConsent,
    /// Reasonable adjustments.
    pub reasonable_adjustments: ReasonableAdjustments,
    /// Health action plan.
    pub health_action_plan: HealthActionPlan,
}

/// A rule that fired during grading — one adaptive-functioning item answered.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: i32,
}

/// Clinician-facing safety / hygiene flag, sorted by priority.
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

/// Grading output for a Learning Disability assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Adaptive score.
    pub adaptive_score: f64,
    /// Severity category.
    pub severity_category: SeverityCategory,
    /// Answered count.
    pub answered_count: i32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
