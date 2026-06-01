use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric Likert score (1-5).
pub type YesNo = String;
pub type Sex = String;
pub type AgeRange = String;
pub type VisitType = String;
pub type ReferralSource = String;
pub type SatisfactionCategory = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub age_range: AgeRange,
    pub ethnicity: String,
    pub preferred_language: String,
    pub interpreter_required: YesNo,
}

/// Step 2 — Visit Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisitDetails {
    pub visit_date: String,
    pub visit_type: VisitType,
    pub department: String,
    pub hospital_site: String,
    pub length_of_stay_days: Option<i32>,
    pub referral_source: ReferralSource,
    pub is_first_visit: YesNo,
}

/// Step 3 — Access & Waiting Times.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AccessWaitingTimes {
    pub ease_of_booking: Option<i32>,
    pub waiting_time_for_appointment: Option<i32>,
    pub waiting_time_on_day: Option<i32>,
    pub reception_service: Option<i32>,
    pub signage_wayfinding: Option<i32>,
    pub parking_transport: Option<i32>,
    pub actual_wait_minutes: Option<i32>,
}

/// Step 4 — Communication & Information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationInformation {
    pub explanation_of_condition: Option<i32>,
    pub explanation_of_treatment: Option<i32>,
    pub opportunity_to_ask_questions: Option<i32>,
    pub listened_to: Option<i32>,
    pub informed_about_medication: Option<i32>,
    pub written_information_quality: Option<i32>,
}

/// Step 5 — Clinical Care Quality.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalCareQuality {
    pub confidence_in_clinician: Option<i32>,
    pub thoroughness_of_examination: Option<i32>,
    pub pain_management: Option<i32>,
    pub involvement_in_decisions: Option<i32>,
    pub privacy_during_examination: Option<i32>,
    pub coordination_of_care: Option<i32>,
}

/// Step 6 — Staff Attitude & Professionalism.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StaffAttitude {
    pub doctor_courtesy: Option<i32>,
    pub nurse_courtesy: Option<i32>,
    pub reception_courtesy: Option<i32>,
    pub respect_for_dignity: Option<i32>,
    pub cultural_sensitivity: Option<i32>,
    pub emotional_support: Option<i32>,
}

/// Step 7 — Environment & Facilities.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentFacilities {
    pub cleanliness: Option<i32>,
    pub comfort: Option<i32>,
    pub noise_levels: Option<i32>,
    pub food_quality: Option<i32>,
    pub toilet_facilities: Option<i32>,
    pub temperature_comfort: Option<i32>,
}

/// Step 8 — Discharge & Follow-up.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DischargeFollowUp {
    pub discharge_information: Option<i32>,
    pub medication_explanation: Option<i32>,
    pub follow_up_arrangements: Option<i32>,
    pub knew_who_to_contact: Option<i32>,
    pub recovery_information: Option<i32>,
    pub care_plan_clarity: Option<i32>,
}

/// Step 9 — Overall Experience.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallExperience {
    pub overall_satisfaction: Option<i32>,
    pub would_recommend: Option<i32>,
    pub met_expectations: Option<i32>,
    pub felt_safe: Option<i32>,
    pub would_return: Option<i32>,
    pub nhs_rating: Option<i32>,
}

/// Step 10 — Comments & Suggestions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommentsSuggestions {
    pub what_went_well: String,
    pub what_could_improve: String,
    pub specific_staff_praise: String,
    pub complaint_raised: YesNo,
    pub complaint_details: String,
    pub additional_comments: String,
    pub consent_to_contact: YesNo,
    pub contact_email: String,
    pub contact_phone: String,
}

/// Full Patient Satisfaction Survey record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub visit_details: VisitDetails,
    pub access_waiting_times: AccessWaitingTimes,
    pub communication_information: CommunicationInformation,
    pub clinical_care_quality: ClinicalCareQuality,
    pub staff_attitude: StaffAttitude,
    pub environment_facilities: EnvironmentFacilities,
    pub discharge_follow_up: DischargeFollowUp,
    pub overall_experience: OverallExperience,
    pub comments_suggestions: CommentsSuggestions,
}

/// Per-domain normalized scores (0-100). `None` indicates the domain has no
/// answered items.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScores {
    pub access: Option<f64>,
    pub communication: Option<f64>,
    pub clinical_care: Option<f64>,
    pub staff: Option<f64>,
    pub environment: Option<f64>,
    pub discharge: Option<f64>,
    pub overall: Option<f64>,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub domain: String,
    pub description: String,
    pub severity: u32,
}

/// A flagged issue computed independently of rule scoring (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a satisfaction survey.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub normalized_score: f64,
    pub satisfaction_category: SatisfactionCategory,
    pub domain_scores: DomainScores,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
