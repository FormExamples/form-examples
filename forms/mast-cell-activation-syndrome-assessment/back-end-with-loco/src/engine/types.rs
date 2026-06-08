//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ────────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Referring physician.
    pub referring_physician: String,
    /// Primary complaint.
    pub primary_complaint: String,
    /// Symptom onset date.
    pub symptom_onset_date: String,
    /// Family history mcas.
    pub family_history_mcas: String,
}

// ─── Symptom History (Step 2) ────────────────────────────────

/// Symptom history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SymptomHistory {
    /// Symptom duration months.
    pub symptom_duration_months: String,
    /// Symptom frequency.
    pub symptom_frequency: String,
    /// Symptom pattern.
    pub symptom_pattern: String,
    /// Symptom severity overall.
    pub symptom_severity_overall: Option<u8>,
    /// Symptom progression.
    pub symptom_progression: String,
    /// Episode duration.
    pub episode_duration: String,
    /// Symptom impact daily life.
    pub symptom_impact_daily_life: Option<u8>,
    /// Emergency visits past year.
    pub emergency_visits_past_year: String,
}

// ─── Skin Manifestations (Step 3) ────────────────────────────

/// Skin manifestations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SkinManifestations {
    /// Flushing severity.
    pub flushing_severity: Option<u8>,
    /// Flushing frequency.
    pub flushing_frequency: String,
    /// Urticaria severity.
    pub urticaria_severity: Option<u8>,
    /// Angioedema severity.
    pub angioedema_severity: Option<u8>,
    /// Dermatographism present.
    pub dermatographism_present: String,
    /// Pruritus severity.
    pub pruritus_severity: Option<u8>,
    /// Skin lesions present.
    pub skin_lesions_present: String,
}

// ─── Gastrointestinal Symptoms (Step 4) ──────────────────────

/// Gastrointestinal symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GastrointestinalSymptoms {
    /// Abdominal pain severity.
    pub abdominal_pain_severity: Option<u8>,
    /// Nausea severity.
    pub nausea_severity: Option<u8>,
    /// Diarrhea severity.
    pub diarrhea_severity: Option<u8>,
    /// Bloating severity.
    pub bloating_severity: Option<u8>,
    /// Gastroesophageal reflux.
    pub gastroesophageal_reflux: Option<u8>,
    /// Food intolerances count.
    pub food_intolerances_count: String,
    /// Malabsorption signs.
    pub malabsorption_signs: String,
}

// ─── Cardiovascular & Neurological (Step 5) ──────────────────

/// Cardiovascular neurological.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularNeurological {
    /// Tachycardia severity.
    pub tachycardia_severity: Option<u8>,
    /// Hypotension episodes.
    pub hypotension_episodes: Option<u8>,
    /// Presyncope syncope.
    pub presyncope_syncope: Option<u8>,
    /// Headache severity.
    pub headache_severity: Option<u8>,
    /// Brain fog severity.
    pub brain_fog_severity: Option<u8>,
    /// Neuropathic pain.
    pub neuropathic_pain: Option<u8>,
    /// Dizziness severity.
    pub dizziness_severity: Option<u8>,
}

// ─── Respiratory Symptoms (Step 6) ───────────────────────────

/// Respiratory symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RespiratorySymptoms {
    /// Wheezing severity.
    pub wheezing_severity: Option<u8>,
    /// Dyspnea severity.
    pub dyspnea_severity: Option<u8>,
    /// Nasal congestion severity.
    pub nasal_congestion_severity: Option<u8>,
    /// Throat tightness severity.
    pub throat_tightness_severity: Option<u8>,
    /// Stridor present.
    pub stridor_present: String,
    /// Cough severity.
    pub cough_severity: Option<u8>,
    /// Previous anaphylaxis.
    pub previous_anaphylaxis: String,
}

// ─── Laboratory Studies (Step 7) ─────────────────────────────

/// Laboratory studies.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LaboratoryStudies {
    /// Serum tryptase elevated.
    pub serum_tryptase_elevated: String,
    /// Serum tryptase level.
    pub serum_tryptase_level: String,
    /// Urine prostaglandin d2 elevated.
    pub urine_prostaglandin_d2_elevated: String,
    /// Urine n methylhistamine elevated.
    pub urine_n_methylhistamine_elevated: String,
    /// Plasma histamine elevated.
    pub plasma_histamine_elevated: String,
    /// Serum chromogranin a elevated.
    pub serum_chromogranin_a_elevated: String,
    /// Other mediators elevated.
    pub other_mediators_elevated: String,
    /// Bone marrow biopsy done.
    pub bone_marrow_biopsy_done: String,
}

// ─── Trigger Identification (Step 8) ─────────────────────────

/// Trigger identification.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TriggerIdentification {
    /// Heat trigger.
    pub heat_trigger: Option<u8>,
    /// Stress trigger.
    pub stress_trigger: Option<u8>,
    /// Exercise trigger.
    pub exercise_trigger: Option<u8>,
    /// Food trigger.
    pub food_trigger: Option<u8>,
    /// Medication trigger.
    pub medication_trigger: Option<u8>,
    /// Fragrance chemical trigger.
    pub fragrance_chemical_trigger: Option<u8>,
    /// Insect sting trigger.
    pub insect_sting_trigger: Option<u8>,
    /// Trigger predictability.
    pub trigger_predictability: String,
}

// ─── Current Treatment (Step 9) ──────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// H1 antihistamine response.
    pub h1_antihistamine_response: Option<u8>,
    /// H2 antihistamine response.
    pub h2_antihistamine_response: Option<u8>,
    /// Mast cell stabilizer response.
    pub mast_cell_stabilizer_response: Option<u8>,
    /// Leukotriene inhibitor response.
    pub leukotriene_inhibitor_response: Option<u8>,
    /// Epinephrine auto injector.
    pub epinephrine_auto_injector: String,
    /// Corticosteroid use.
    pub corticosteroid_use: String,
    /// Other medications.
    pub other_medications: String,
    /// Treatment adherence.
    pub treatment_adherence: Option<u8>,
}

// ─── Clinical Review (Step 10) ───────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Consensus criteria met.
    pub consensus_criteria_met: String,
    /// Organ systems involved count.
    pub organ_systems_involved_count: String,
    /// Response to mediator therapy.
    pub response_to_mediator_therapy: Option<u8>,
    /// Differential diagnoses excluded.
    pub differential_diagnoses_excluded: String,
    /// Comorbid conditions.
    pub comorbid_conditions: String,
    /// Quality of life impact.
    pub quality_of_life_impact: Option<u8>,
    /// Clinician severity assessment.
    pub clinician_severity_assessment: Option<u8>,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ──────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Symptom history.
    pub symptom_history: SymptomHistory,
    /// Skin manifestations.
    pub skin_manifestations: SkinManifestations,
    /// Gastrointestinal symptoms.
    pub gastrointestinal_symptoms: GastrointestinalSymptoms,
    /// Cardiovascular neurological.
    pub cardiovascular_neurological: CardiovascularNeurological,
    /// Respiratory symptoms.
    pub respiratory_symptoms: RespiratorySymptoms,
    /// Laboratory studies.
    pub laboratory_studies: LaboratoryStudies,
    /// Trigger identification.
    pub trigger_identification: TriggerIdentification,
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
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
