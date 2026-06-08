//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referral source.
    pub referral_source: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician role.
    pub clinician_role: String,
}

// ─── Presenting Complaint (Step 2) ──────────────────────────

/// Presenting complaint.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PresentingComplaint {
    /// Chief complaint.
    pub chief_complaint: String,
    /// Onset duration.
    pub onset_duration: String,
    /// Symptom severity.
    pub symptom_severity: Option<u8>,
    /// Functional impact.
    pub functional_impact: Option<u8>,
    /// Symptom progression.
    pub symptom_progression: String,
    /// Precipitating factors.
    pub precipitating_factors: String,
}

// ─── Psychiatric History (Step 3) ───────────────────────────

/// Psychiatric history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PsychiatricHistory {
    /// Previous diagnoses.
    pub previous_diagnoses: String,
    /// Previous hospitalizations.
    pub previous_hospitalizations: String,
    /// Hospitalization count.
    pub hospitalization_count: String,
    /// Previous treatments.
    pub previous_treatments: String,
    /// Treatment response.
    pub treatment_response: Option<u8>,
    /// Therapy history.
    pub therapy_history: String,
}

// ─── Mental State Examination (Step 4) ──────────────────────

/// Mental state examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MentalStateExamination {
    /// Appearance behaviour.
    pub appearance_behaviour: Option<u8>,
    /// Speech assessment.
    pub speech_assessment: Option<u8>,
    /// Mood rating.
    pub mood_rating: Option<u8>,
    /// Affect congruence.
    pub affect_congruence: Option<u8>,
    /// Thought form.
    pub thought_form: Option<u8>,
    /// Thought content.
    pub thought_content: Option<u8>,
    /// Perception.
    pub perception: Option<u8>,
    /// Cognition.
    pub cognition: Option<u8>,
    /// Insight judgement.
    pub insight_judgement: Option<u8>,
}

// ─── Risk Assessment (Step 5) ───────────────────────────────

/// Risk assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RiskAssessment {
    /// Suicidal ideation.
    pub suicidal_ideation: Option<u8>,
    /// Self harm risk.
    pub self_harm_risk: Option<u8>,
    /// Harm to others.
    pub harm_to_others: Option<u8>,
    /// Safeguarding concerns.
    pub safeguarding_concerns: Option<u8>,
    /// Risk plan specificity.
    pub risk_plan_specificity: Option<u8>,
    /// Protective factors.
    pub protective_factors: Option<u8>,
}

// ─── Substance Use (Step 6) ────────────────────────────────

/// Substance use.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceUse {
    /// Alcohol use.
    pub alcohol_use: Option<u8>,
    /// Drug use.
    pub drug_use: Option<u8>,
    /// Tobacco use.
    pub tobacco_use: String,
    /// Substance impact.
    pub substance_impact: Option<u8>,
    /// Withdrawal risk.
    pub withdrawal_risk: Option<u8>,
    /// Readiness to change.
    pub readiness_to_change: Option<u8>,
}

// ─── Social & Functional (Step 7) ──────────────────────────

/// Social functional.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SocialFunctional {
    /// Living situation.
    pub living_situation: String,
    /// Employment status.
    pub employment_status: String,
    /// Social support.
    pub social_support: Option<u8>,
    /// Daily functioning.
    pub daily_functioning: Option<u8>,
    /// Relationship quality.
    pub relationship_quality: Option<u8>,
    /// Financial concerns.
    pub financial_concerns: String,
}

// ─── Family History (Step 8) ────────────────────────────────

/// Family history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FamilyHistory {
    /// Family psychiatric history.
    pub family_psychiatric_history: String,
    /// Family suicide history.
    pub family_suicide_history: String,
    /// Family substance use.
    pub family_substance_use: String,
    /// Adverse childhood experiences.
    pub adverse_childhood_experiences: Option<u8>,
    /// Family support level.
    pub family_support_level: Option<u8>,
    /// Genetic risk factors.
    pub genetic_risk_factors: String,
}

// ─── Current Treatment (Step 9) ─────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Current medications.
    pub current_medications: String,
    /// Medication adherence.
    pub medication_adherence: Option<u8>,
    /// Side effects severity.
    pub side_effects_severity: Option<u8>,
    /// Therapy engagement.
    pub therapy_engagement: Option<u8>,
    /// Treatment satisfaction.
    pub treatment_satisfaction: Option<u8>,
    /// Barriers to treatment.
    pub barriers_to_treatment: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall severity.
    pub overall_severity: Option<u8>,
    /// Treatment urgency.
    pub treatment_urgency: Option<u8>,
    /// Prognosis outlook.
    pub prognosis_outlook: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Additional referrals.
    pub additional_referrals: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Presenting complaint.
    pub presenting_complaint: PresentingComplaint,
    /// Psychiatric history.
    pub psychiatric_history: PsychiatricHistory,
    /// Mental state examination.
    pub mental_state_examination: MentalStateExamination,
    /// Risk assessment.
    pub risk_assessment: RiskAssessment,
    /// Substance use.
    pub substance_use: SubstanceUse,
    /// Social functional.
    pub social_functional: SocialFunctional,
    /// Family history.
    pub family_history: FamilyHistory,
    /// Current treatment.
    pub current_treatment: CurrentTreatment,
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
    /// Severity level.
    pub severity_level: SeverityLevel,
    /// Severity score.
    pub severity_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
