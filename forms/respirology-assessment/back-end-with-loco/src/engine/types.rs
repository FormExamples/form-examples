//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Respiratory level.
pub type RespiratoryLevel = String;

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
    /// Patient age.
    pub patient_age: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Pack years.
    pub pack_years: String,
    /// Occupational exposure.
    pub occupational_exposure: String,
    /// Referral source.
    pub referral_source: String,
}

// ─── Respiratory Symptoms (Step 2) ──────────────────────────

/// Respiratory symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RespiratorySymptoms {
    /// Dyspnoea severity.
    pub dyspnoea_severity: Option<u8>,
    /// Wheeze frequency.
    pub wheeze_frequency: Option<u8>,
    /// Chest tightness.
    pub chest_tightness: Option<u8>,
    /// Exercise tolerance.
    pub exercise_tolerance: Option<u8>,
    /// Nocturnal symptoms.
    pub nocturnal_symptoms: Option<u8>,
    /// Symptom duration.
    pub symptom_duration: String,
}

// ─── Cough Assessment (Step 3) ──────────────────────────────

/// Cough assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CoughAssessment {
    /// Cough severity.
    pub cough_severity: Option<u8>,
    /// Cough frequency.
    pub cough_frequency: Option<u8>,
    /// Sputum production.
    pub sputum_production: Option<u8>,
    /// Haemoptysis.
    pub haemoptysis: Option<u8>,
    /// Cough duration.
    pub cough_duration: String,
    /// Cough character.
    pub cough_character: String,
}

// ─── Dyspnoea Assessment (Step 4) ───────────────────────────

/// Dyspnoea assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DyspnoeaAssessment {
    /// Mrc dyspnoea scale.
    pub mrc_dyspnoea_scale: Option<u8>,
    /// Dyspnoea at rest.
    pub dyspnoea_at_rest: Option<u8>,
    /// Dyspnoea on exertion.
    pub dyspnoea_on_exertion: Option<u8>,
    /// Orthopnoea.
    pub orthopnoea: Option<u8>,
    /// Paroxysmal nocturnal dyspnoea.
    pub paroxysmal_nocturnal_dyspnoea: Option<u8>,
    /// Dyspnoea trend.
    pub dyspnoea_trend: String,
}

// ─── Chest Examination (Step 5) ─────────────────────────────

/// Chest examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ChestExamination {
    /// Breath sounds.
    pub breath_sounds: Option<u8>,
    /// Chest expansion.
    pub chest_expansion: Option<u8>,
    /// Percussion note.
    pub percussion_note: Option<u8>,
    /// Vocal resonance.
    pub vocal_resonance: Option<u8>,
    /// Accessory muscle use.
    pub accessory_muscle_use: Option<u8>,
    /// Chest deformity.
    pub chest_deformity: String,
}

// ─── Spirometry Results (Step 6) ────────────────────────────

/// Spirometry results.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SpirometryResults {
    /// Fev1 percent predicted.
    pub fev1_percent_predicted: Option<u8>,
    /// Fvc percent predicted.
    pub fvc_percent_predicted: Option<u8>,
    /// Fev1 fvc ratio.
    pub fev1_fvc_ratio: Option<u8>,
    /// Peak flow percent predicted.
    pub peak_flow_percent_predicted: Option<u8>,
    /// Bronchodilator response.
    pub bronchodilator_response: Option<u8>,
    /// Spirometry quality.
    pub spirometry_quality: String,
}

// ─── Oxygen Assessment (Step 7) ─────────────────────────────

/// Oxygen assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OxygenAssessment {
    /// Resting SpO2.
    pub resting_spo2: Option<u8>,
    /// Exertional SpO2.
    pub exertional_spo2: Option<u8>,
    /// Oxygen requirement.
    pub oxygen_requirement: Option<u8>,
    /// Arterial blood gas.
    pub arterial_blood_gas: Option<u8>,
    /// Supplemental oxygen use.
    pub supplemental_oxygen_use: String,
    /// Oxygen delivery method.
    pub oxygen_delivery_method: String,
}

// ─── Respiratory Infections (Step 8) ────────────────────────

/// Respiratory infections.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RespiratoryInfections {
    /// Exacerbation frequency.
    pub exacerbation_frequency: Option<u8>,
    /// Antibiotic courses.
    pub antibiotic_courses: Option<u8>,
    /// Hospitalisation frequency.
    pub hospitalisation_frequency: Option<u8>,
    /// Vaccination status.
    pub vaccination_status: Option<u8>,
    /// Last exacerbation.
    pub last_exacerbation: String,
    /// Sputum culture.
    pub sputum_culture: String,
}

// ─── Inhaler & Medications (Step 9) ─────────────────────────

/// Inhaler medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct InhalerMedications {
    /// Inhaler technique.
    pub inhaler_technique: Option<u8>,
    /// Medication adherence.
    pub medication_adherence: Option<u8>,
    /// Inhaler device suitability.
    pub inhaler_device_suitability: Option<u8>,
    /// Side effects severity.
    pub side_effects_severity: Option<u8>,
    /// Current inhalers.
    pub current_inhalers: String,
    /// Oral medications.
    pub oral_medications: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall respiratory status.
    pub overall_respiratory_status: Option<u8>,
    /// Quality of life impact.
    pub quality_of_life_impact: Option<u8>,
    /// Treatment response.
    pub treatment_response: Option<u8>,
    /// Follow up urgency.
    pub follow_up_urgency: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Action plan provided.
    pub action_plan_provided: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Respiratory symptoms.
    pub respiratory_symptoms: RespiratorySymptoms,
    /// Cough assessment.
    pub cough_assessment: CoughAssessment,
    /// Dyspnoea assessment.
    pub dyspnoea_assessment: DyspnoeaAssessment,
    /// Chest examination.
    pub chest_examination: ChestExamination,
    /// Spirometry results.
    pub spirometry_results: SpirometryResults,
    /// Oxygen assessment.
    pub oxygen_assessment: OxygenAssessment,
    /// Respiratory infections.
    pub respiratory_infections: RespiratoryInfections,
    /// Inhaler medications.
    pub inhaler_medications: InhalerMedications,
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
    /// Respiratory level.
    pub respiratory_level: RespiratoryLevel,
    /// Respiratory score.
    pub respiratory_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
