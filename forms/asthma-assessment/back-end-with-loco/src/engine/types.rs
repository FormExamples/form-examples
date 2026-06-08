//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Control level.
pub type ControlLevel = String;

// ─── Patient Information (Step 1) ──────────────────────────

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

// ─── Asthma History (Step 2) ───────────────────────────────

/// Asthma history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AsthmaHistory {
    /// Age at diagnosis.
    pub age_at_diagnosis: Option<u8>,
    /// Years with asthma.
    pub years_with_asthma: Option<u8>,
    /// Family asthma history.
    pub family_asthma_history: String,
    /// Allergy history.
    pub allergy_history: String,
    /// Previous hospitalisations.
    pub previous_hospitalisations: Option<u8>,
    /// Previous icu admissions.
    pub previous_icu_admissions: Option<u8>,
    /// Best peak flow.
    pub best_peak_flow: Option<f64>,
}

// ─── Symptom Assessment (Step 3) ───────────────────────────

/// Symptom assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SymptomAssessment {
    /// Daytime symptoms.
    pub daytime_symptoms: Option<u8>,
    /// Night waking.
    pub night_waking: Option<u8>,
    /// Reliever use.
    pub reliever_use: Option<u8>,
    /// Activity limitation.
    pub activity_limitation: Option<u8>,
    /// Symptom free days.
    pub symptom_free_days: Option<u8>,
    /// Cough severity.
    pub cough_severity: Option<u8>,
    /// Wheeze severity.
    pub wheeze_severity: Option<u8>,
    /// Breathlessness.
    pub breathlessness: Option<u8>,
}

// ─── Lung Function (Step 4) ────────────────────────────────

/// Lung function.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LungFunction {
    /// Current peak flow.
    pub current_peak_flow: Option<f64>,
    /// Predicted peak flow.
    pub predicted_peak_flow: Option<f64>,
    /// Peak flow variability.
    pub peak_flow_variability: Option<f64>,
    /// Fev1.
    pub fev1: Option<f64>,
    /// Fev1 predicted.
    pub fev1_predicted: Option<f64>,
    /// Fev1 fvc ratio.
    pub fev1_fvc_ratio: Option<f64>,
    /// Reversibility test.
    pub reversibility_test: String,
}

// ─── Triggers & Exacerbations (Step 5) ─────────────────────

/// Triggers exacerbations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TriggersExacerbations {
    /// Exercise trigger.
    pub exercise_trigger: String,
    /// Cold air trigger.
    pub cold_air_trigger: String,
    /// Allergen trigger.
    pub allergen_trigger: String,
    /// Infection trigger.
    pub infection_trigger: String,
    /// Emotional trigger.
    pub emotional_trigger: String,
    /// Exacerbations last12 months.
    pub exacerbations_last12_months: Option<u8>,
    /// Oral steroid courses.
    pub oral_steroid_courses: Option<u8>,
    /// Emergency visits.
    pub emergency_visits: Option<u8>,
}

// ─── Current Medications (Step 6) ──────────────────────────

/// Current medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// Saba use.
    pub saba_use: String,
    /// Ics dose.
    pub ics_dose: String,
    /// Ics name.
    pub ics_name: String,
    /// Laba use.
    pub laba_use: String,
    /// Ltra use.
    pub ltra_use: String,
    /// Biologic therapy.
    pub biologic_therapy: String,
    /// Preventer adherence.
    pub preventer_adherence: Option<u8>,
    /// Gina step.
    pub gina_step: String,
}

// ─── Inhaler Technique (Step 7) ────────────────────────────

/// Inhaler technique.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct InhalerTechnique {
    /// Inhaler type.
    pub inhaler_type: String,
    /// Technique assessed.
    pub technique_assessed: String,
    /// Technique score.
    pub technique_score: Option<u8>,
    /// Spacer used.
    pub spacer_used: String,
    /// Common errors.
    pub common_errors: String,
    /// Education provided.
    pub education_provided: String,
}

// ─── Comorbidities (Step 8) ────────────────────────────────

/// Comorbidities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Comorbidities {
    /// Rhinitis.
    pub rhinitis: String,
    /// Sinusitis.
    pub sinusitis: String,
    /// Gerd.
    pub gerd: String,
    /// Obesity.
    pub obesity: String,
    /// Obstructive sleep apnoea.
    pub obstructive_sleep_apnoea: String,
    /// Anxiety depression.
    pub anxiety_depression: String,
    /// Allergy coexistence.
    pub allergy_coexistence: String,
}

// ─── Lifestyle & Environment (Step 9) ──────────────────────

/// Lifestyle environment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleEnvironment {
    /// Smoking status.
    pub smoking_status: String,
    /// Second hand smoke.
    pub second_hand_smoke: String,
    /// Occupation.
    pub occupation: String,
    /// Occupational exposure.
    pub occupational_exposure: String,
    /// Pet exposure.
    pub pet_exposure: String,
    /// Home environment.
    pub home_environment: String,
    /// Exercise frequency.
    pub exercise_frequency: String,
}

// ─── Review & Management Plan (Step 10) ────────────────────

/// Review management plan.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReviewManagementPlan {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Control level.
    pub control_level: String,
    /// Gina step recommended.
    pub gina_step_recommended: String,
    /// Action plan provided.
    pub action_plan_provided: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Next review date.
    pub next_review_date: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Asthma history.
    pub asthma_history: AsthmaHistory,
    /// Symptom assessment.
    pub symptom_assessment: SymptomAssessment,
    /// Lung function.
    pub lung_function: LungFunction,
    /// Triggers exacerbations.
    pub triggers_exacerbations: TriggersExacerbations,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Inhaler technique.
    pub inhaler_technique: InhalerTechnique,
    /// Comorbidities.
    pub comorbidities: Comorbidities,
    /// Lifestyle environment.
    pub lifestyle_environment: LifestyleEnvironment,
    /// Review management plan.
    pub review_management_plan: ReviewManagementPlan,
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
    /// Control level.
    pub control_level: ControlLevel,
    /// Gina criteria met.
    pub gina_criteria_met: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
