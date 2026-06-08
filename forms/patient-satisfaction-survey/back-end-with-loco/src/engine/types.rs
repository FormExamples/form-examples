//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric Likert score (1-5).
/// Yes no.
pub type YesNo = String;
/// Sex.
pub type Sex = String;
/// Age range.
pub type AgeRange = String;
/// Visit type.
pub type VisitType = String;
/// Referral source.
pub type ReferralSource = String;
/// Satisfaction category.
pub type SatisfactionCategory = String;

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
    pub sex: Sex,
    /// Age range.
    pub age_range: AgeRange,
    /// Ethnicity.
    pub ethnicity: String,
    /// Preferred language.
    pub preferred_language: String,
    /// Interpreter required.
    pub interpreter_required: YesNo,
}

/// Step 2 — Visit Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisitDetails {
    /// Visit date.
    pub visit_date: String,
    /// Visit type.
    pub visit_type: VisitType,
    /// Department.
    pub department: String,
    /// Hospital site.
    pub hospital_site: String,
    /// Length of stay days.
    pub length_of_stay_days: Option<i32>,
    /// Referral source.
    pub referral_source: ReferralSource,
    /// Is first visit.
    pub is_first_visit: YesNo,
}

/// Step 3 — Access & Waiting Times.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AccessWaitingTimes {
    /// Ease of booking.
    pub ease_of_booking: Option<i32>,
    /// Waiting time for appointment.
    pub waiting_time_for_appointment: Option<i32>,
    /// Waiting time on day.
    pub waiting_time_on_day: Option<i32>,
    /// Reception service.
    pub reception_service: Option<i32>,
    /// Signage wayfinding.
    pub signage_wayfinding: Option<i32>,
    /// Parking transport.
    pub parking_transport: Option<i32>,
    /// Actual wait minutes.
    pub actual_wait_minutes: Option<i32>,
}

/// Step 4 — Communication & Information.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationInformation {
    /// Explanation of condition.
    pub explanation_of_condition: Option<i32>,
    /// Explanation of treatment.
    pub explanation_of_treatment: Option<i32>,
    /// Opportunity to ask questions.
    pub opportunity_to_ask_questions: Option<i32>,
    /// Listened to.
    pub listened_to: Option<i32>,
    /// Informed about medication.
    pub informed_about_medication: Option<i32>,
    /// Written information quality.
    pub written_information_quality: Option<i32>,
}

/// Step 5 — Clinical Care Quality.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalCareQuality {
    /// Confidence in clinician.
    pub confidence_in_clinician: Option<i32>,
    /// Thoroughness of examination.
    pub thoroughness_of_examination: Option<i32>,
    /// Pain management.
    pub pain_management: Option<i32>,
    /// Involvement in decisions.
    pub involvement_in_decisions: Option<i32>,
    /// Privacy during examination.
    pub privacy_during_examination: Option<i32>,
    /// Coordination of care.
    pub coordination_of_care: Option<i32>,
}

/// Step 6 — Staff Attitude & Professionalism.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StaffAttitude {
    /// Doctor courtesy.
    pub doctor_courtesy: Option<i32>,
    /// Nurse courtesy.
    pub nurse_courtesy: Option<i32>,
    /// Reception courtesy.
    pub reception_courtesy: Option<i32>,
    /// Respect for dignity.
    pub respect_for_dignity: Option<i32>,
    /// Cultural sensitivity.
    pub cultural_sensitivity: Option<i32>,
    /// Emotional support.
    pub emotional_support: Option<i32>,
}

/// Step 7 — Environment & Facilities.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentFacilities {
    /// Cleanliness.
    pub cleanliness: Option<i32>,
    /// Comfort.
    pub comfort: Option<i32>,
    /// Noise levels.
    pub noise_levels: Option<i32>,
    /// Food quality.
    pub food_quality: Option<i32>,
    /// Toilet facilities.
    pub toilet_facilities: Option<i32>,
    /// Temperature comfort.
    pub temperature_comfort: Option<i32>,
}

/// Step 8 — Discharge & Follow-up.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DischargeFollowUp {
    /// Discharge information.
    pub discharge_information: Option<i32>,
    /// Medication explanation.
    pub medication_explanation: Option<i32>,
    /// Follow up arrangements.
    pub follow_up_arrangements: Option<i32>,
    /// Knew who to contact.
    pub knew_who_to_contact: Option<i32>,
    /// Recovery information.
    pub recovery_information: Option<i32>,
    /// Care plan clarity.
    pub care_plan_clarity: Option<i32>,
}

/// Step 9 — Overall Experience.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OverallExperience {
    /// Overall satisfaction.
    pub overall_satisfaction: Option<i32>,
    /// Would recommend.
    pub would_recommend: Option<i32>,
    /// Met expectations.
    pub met_expectations: Option<i32>,
    /// Felt safe.
    pub felt_safe: Option<i32>,
    /// Would return.
    pub would_return: Option<i32>,
    /// NHS rating.
    pub nhs_rating: Option<i32>,
}

/// Step 10 — Comments & Suggestions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommentsSuggestions {
    /// What went well.
    pub what_went_well: String,
    /// What could improve.
    pub what_could_improve: String,
    /// Specific staff praise.
    pub specific_staff_praise: String,
    /// Complaint raised.
    pub complaint_raised: YesNo,
    /// Complaint details.
    pub complaint_details: String,
    /// Additional comments.
    pub additional_comments: String,
    /// Consent to contact.
    pub consent_to_contact: YesNo,
    /// Contact email.
    pub contact_email: String,
    /// Contact phone.
    pub contact_phone: String,
}

/// Full Patient Satisfaction Survey record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Visit details.
    pub visit_details: VisitDetails,
    /// Access waiting times.
    pub access_waiting_times: AccessWaitingTimes,
    /// Communication information.
    pub communication_information: CommunicationInformation,
    /// Clinical care quality.
    pub clinical_care_quality: ClinicalCareQuality,
    /// Staff attitude.
    pub staff_attitude: StaffAttitude,
    /// Environment facilities.
    pub environment_facilities: EnvironmentFacilities,
    /// Discharge follow up.
    pub discharge_follow_up: DischargeFollowUp,
    /// Overall experience.
    pub overall_experience: OverallExperience,
    /// Comments suggestions.
    pub comments_suggestions: CommentsSuggestions,
}

/// Per-domain normalized scores (0-100). `None` indicates the domain has no
/// answered items.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScores {
    /// Access.
    pub access: Option<f64>,
    /// Communication.
    pub communication: Option<f64>,
    /// Clinical care.
    pub clinical_care: Option<f64>,
    /// Staff.
    pub staff: Option<f64>,
    /// Environment.
    pub environment: Option<f64>,
    /// Discharge.
    pub discharge: Option<f64>,
    /// Overall.
    pub overall: Option<f64>,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Domain.
    pub domain: String,
    /// Description.
    pub description: String,
    /// Severity.
    pub severity: u32,
}

/// A flagged issue computed independently of rule scoring (real-time alert).
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

/// Grading output for a satisfaction survey.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Normalized score.
    pub normalized_score: f64,
    /// Satisfaction category.
    pub satisfaction_category: SatisfactionCategory,
    /// Domain scores.
    pub domain_scores: DomainScores,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
