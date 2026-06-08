//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Hearing aid level.
pub type HearingAidLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referral source.
    pub referral_source: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Audiologist name.
    pub audiologist_name: String,
}

// ─── Hearing History (Step 2) ───────────────────────────────

/// Hearing history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HearingHistory {
    /// Onset duration.
    pub onset_duration: String,
    /// Hearing loss type.
    pub hearing_loss_type: String,
    /// Affected ear.
    pub affected_ear: String,
    /// Family history.
    pub family_history: String,
    /// Noise exposure.
    pub noise_exposure: String,
    /// Tinnitus present.
    pub tinnitus_present: String,
    /// Previous hearing aid use.
    pub previous_hearing_aid_use: String,
    /// Medical conditions.
    pub medical_conditions: String,
}

// ─── Audiometric Results (Step 3) ───────────────────────────

/// Audiometric results.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AudiometricResults {
    /// Right ear pta.
    pub right_ear_pta: Option<u8>,
    /// Left ear pta.
    pub left_ear_pta: Option<u8>,
    /// Speech recognition right.
    pub speech_recognition_right: Option<u8>,
    /// Speech recognition left.
    pub speech_recognition_left: Option<u8>,
    /// Hearing loss severity.
    pub hearing_loss_severity: String,
    /// Audiogram configuration.
    pub audiogram_configuration: String,
}

// ─── Communication Needs (Step 4) ──────────────────────────

/// Communication needs.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationNeeds {
    /// Quiet conversation.
    pub quiet_conversation: Option<u8>,
    /// Group conversation.
    pub group_conversation: Option<u8>,
    /// Telephone use.
    pub telephone_use: Option<u8>,
    /// Television listening.
    pub television_listening: Option<u8>,
    /// Public settings.
    pub public_settings: Option<u8>,
    /// Workplace communication.
    pub workplace_communication: Option<u8>,
}

// ─── Lifestyle Assessment (Step 5) ─────────────────────────

/// Lifestyle assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleAssessment {
    /// Social activity level.
    pub social_activity_level: Option<u8>,
    /// Outdoor activity level.
    pub outdoor_activity_level: Option<u8>,
    /// Technology comfort.
    pub technology_comfort: Option<u8>,
    /// Manual dexterity.
    pub manual_dexterity: Option<u8>,
    /// Cosmetic concern.
    pub cosmetic_concern: Option<u8>,
    /// Motivation level.
    pub motivation_level: Option<u8>,
}

// ─── Current Hearing Aids (Step 6) ─────────────────────────

/// Current hearing aids.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentHearingAids {
    /// Currently wearing.
    pub currently_wearing: String,
    /// Current aid type.
    pub current_aid_type: String,
    /// Current aid age.
    pub current_aid_age: String,
    /// Satisfaction with current.
    pub satisfaction_with_current: Option<u8>,
    /// Daily usage hours.
    pub daily_usage_hours: String,
    /// Current aid issues.
    pub current_aid_issues: String,
}

// ─── Fitting Requirements (Step 7) ─────────────────────────

/// Fitting requirements.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FittingRequirements {
    /// Preferred style.
    pub preferred_style: String,
    /// Ear canal suitability.
    pub ear_canal_suitability: Option<u8>,
    /// Connectivity needs.
    pub connectivity_needs: Option<u8>,
    /// Rechargeable preference.
    pub rechargeable_preference: String,
    /// Bilateral fitting.
    pub bilateral_fitting: String,
    /// Budget range.
    pub budget_range: String,
}

// ─── Expectations & Goals (Step 8) ─────────────────────────

/// Expectations goals.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ExpectationsGoals {
    /// Realistic expectations.
    pub realistic_expectations: Option<u8>,
    /// Primary goal.
    pub primary_goal: String,
    /// Willingness to adapt.
    pub willingness_to_adapt: Option<u8>,
    /// Support system.
    pub support_system: Option<u8>,
    /// Follow up commitment.
    pub follow_up_commitment: Option<u8>,
    /// Overall readiness.
    pub overall_readiness: Option<u8>,
}

// ─── Trial Period (Step 9) ─────────────────────────────────

/// Trial period.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TrialPeriod {
    /// Trial duration.
    pub trial_duration: String,
    /// Initial comfort.
    pub initial_comfort: Option<u8>,
    /// Sound quality.
    pub sound_quality: Option<u8>,
    /// Feedback management.
    pub feedback_management: Option<u8>,
    /// Daily wear compliance.
    pub daily_wear_compliance: Option<u8>,
    /// Reported benefit.
    pub reported_benefit: Option<u8>,
}

// ─── Clinical Review (Step 10) ─────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Aided improvement.
    pub aided_improvement: Option<u8>,
    /// Patient satisfaction.
    pub patient_satisfaction: Option<u8>,
    /// Recommendation confidence.
    pub recommendation_confidence: Option<u8>,
    /// Additional services needed.
    pub additional_services_needed: String,
    /// Clinician notes.
    pub clinician_notes: String,
    /// Follow up plan.
    pub follow_up_plan: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Hearing history.
    pub hearing_history: HearingHistory,
    /// Audiometric results.
    pub audiometric_results: AudiometricResults,
    /// Communication needs.
    pub communication_needs: CommunicationNeeds,
    /// Lifestyle assessment.
    pub lifestyle_assessment: LifestyleAssessment,
    /// Current hearing aids.
    pub current_hearing_aids: CurrentHearingAids,
    /// Fitting requirements.
    pub fitting_requirements: FittingRequirements,
    /// Expectations goals.
    pub expectations_goals: ExpectationsGoals,
    /// Trial period.
    pub trial_period: TrialPeriod,
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
    /// Hearing aid level.
    pub hearing_aid_level: HearingAidLevel,
    /// Hearing aid score.
    pub hearing_aid_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
