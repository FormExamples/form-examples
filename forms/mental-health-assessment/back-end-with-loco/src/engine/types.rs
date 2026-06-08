//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ────────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Telephone.
    pub telephone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
}

// ─── Presenting Concerns (Step 2) ────────────────────────────

/// Presenting concerns.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PresentingConcerns {
    /// Primary concern.
    pub primary_concern: String,
    /// Duration of symptoms.
    pub duration_of_symptoms: String,
    /// Onset type.
    pub onset_type: String,
    /// Precipitating factors.
    pub precipitating_factors: String,
    /// Current mood rating.
    pub current_mood_rating: Option<u8>,
    /// Sleep quality.
    pub sleep_quality: Option<u8>,
    /// Appetite change.
    pub appetite_change: String,
}

// ─── Depression Screening PHQ-9 (Step 3) ─────────────────────

/// Depression screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DepressionScreening {
    /// Phq1 interest.
    pub phq1_interest: Option<u8>,
    /// Phq2 mood.
    pub phq2_mood: Option<u8>,
    /// Phq3 sleep.
    pub phq3_sleep: Option<u8>,
    /// Phq4 fatigue.
    pub phq4_fatigue: Option<u8>,
    /// Phq5 appetite.
    pub phq5_appetite: Option<u8>,
    /// Phq6 self esteem.
    pub phq6_self_esteem: Option<u8>,
    /// Phq7 concentration.
    pub phq7_concentration: Option<u8>,
    /// Phq8 psychomotor.
    pub phq8_psychomotor: Option<u8>,
    /// Phq9 self harm.
    pub phq9_self_harm: Option<u8>,
}

// ─── Anxiety Screening GAD-7 (Step 4) ────────────────────────

/// Anxiety screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AnxietyScreening {
    /// Gad1 nervous.
    pub gad1_nervous: Option<u8>,
    /// Gad2 uncontrollable.
    pub gad2_uncontrollable: Option<u8>,
    /// Gad3 excessive worry.
    pub gad3_excessive_worry: Option<u8>,
    /// Gad4 trouble relaxing.
    pub gad4_trouble_relaxing: Option<u8>,
    /// Gad5 restless.
    pub gad5_restless: Option<u8>,
    /// Gad6 irritable.
    pub gad6_irritable: Option<u8>,
    /// Gad7 afraid.
    pub gad7_afraid: Option<u8>,
}

// ─── Risk Assessment (Step 5) ────────────────────────────────

/// Risk assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RiskAssessment {
    /// Suicidal ideation.
    pub suicidal_ideation: String,
    /// Self harm history.
    pub self_harm_history: String,
    /// Self harm recent.
    pub self_harm_recent: String,
    /// Suicide plan or means.
    pub suicide_plan_or_means: String,
    /// Protective factors.
    pub protective_factors: String,
    /// Risk level.
    pub risk_level: String,
    /// Safeguarding concerns.
    pub safeguarding_concerns: String,
}

// ─── Substance Use (Step 6) ──────────────────────────────────

/// Substance use.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceUse {
    /// Alcohol use.
    pub alcohol_use: String,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<f64>,
    /// Audit score.
    pub audit_score: Option<u8>,
    /// Cannabis use.
    pub cannabis_use: String,
    /// Other substances.
    pub other_substances: String,
    /// Prescription misuse.
    pub prescription_misuse: String,
    /// Substance impact.
    pub substance_impact: Option<u8>,
}

// ─── Social & Functional Status (Step 7) ─────────────────────

/// Social functional status.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SocialFunctionalStatus {
    /// Employment status.
    pub employment_status: String,
    /// Housing status.
    pub housing_status: String,
    /// Social support.
    pub social_support: Option<u8>,
    /// Relationship status.
    pub relationship_status: String,
    /// Financial concerns.
    pub financial_concerns: String,
    /// Daily functioning.
    pub daily_functioning: Option<u8>,
    /// Work impact.
    pub work_impact: Option<u8>,
    /// Social impact.
    pub social_impact: Option<u8>,
}

// ─── Mental Health History (Step 8) ──────────────────────────

/// Mental health history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthHistory {
    /// Previous diagnoses.
    pub previous_diagnoses: String,
    /// Previous treatment.
    pub previous_treatment: String,
    /// Hospitalisations.
    pub hospitalisations: Option<u8>,
    /// Family mental health.
    pub family_mental_health: String,
    /// Trauma history.
    pub trauma_history: String,
    /// Childhood adversity.
    pub childhood_adversity: String,
    /// Current diagnosis.
    pub current_diagnosis: String,
}

// ─── Current Treatment (Step 9) ──────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Current medication.
    pub current_medication: String,
    /// Medication adherence.
    pub medication_adherence: Option<u8>,
    /// Therapy type.
    pub therapy_type: String,
    /// Therapy frequency.
    pub therapy_frequency: String,
    /// Therapy duration.
    pub therapy_duration: String,
    /// Side effects.
    pub side_effects: String,
    /// Treatment response.
    pub treatment_response: Option<u8>,
}

// ─── Clinical Review (Step 10) ───────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Clinical impression.
    pub clinical_impression: String,
    /// Phq9 total.
    pub phq9_total: Option<u8>,
    /// Gad7 total.
    pub gad7_total: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Referral needed.
    pub referral_needed: String,
}

// ─── Assessment Data (all sections) ──────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Presenting concerns.
    pub presenting_concerns: PresentingConcerns,
    /// Depression screening.
    pub depression_screening: DepressionScreening,
    /// Anxiety screening.
    pub anxiety_screening: AnxietyScreening,
    /// Risk assessment.
    pub risk_assessment: RiskAssessment,
    /// Substance use.
    pub substance_use: SubstanceUse,
    /// Social functional status.
    pub social_functional_status: SocialFunctionalStatus,
    /// Mental health history.
    pub mental_health_history: MentalHealthHistory,
    /// Current treatment.
    pub current_treatment: CurrentTreatment,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ───────────────────────────────────────────

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
    /// Phq9 total.
    pub phq9_total: u8,
    /// Gad7 total.
    pub gad7_total: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
