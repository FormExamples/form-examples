//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Abnormality level.
pub type AbnormalityLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Medical record number.
    pub medical_record_number: String,
    /// Referring physician.
    pub referring_physician: String,
    /// Clinical indication.
    pub clinical_indication: String,
    /// Specimen date.
    pub specimen_date: String,
    /// Specimen type.
    pub specimen_type: String,
}

// ─── Blood Count Analysis (Step 2) ──────────────────────────

/// Blood count analysis.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BloodCountAnalysis {
    /// Hemoglobin.
    pub hemoglobin: Option<f64>,
    /// Hematocrit.
    pub hematocrit: Option<f64>,
    /// Red blood cell count.
    pub red_blood_cell_count: Option<f64>,
    /// White blood cell count.
    pub white_blood_cell_count: Option<f64>,
    /// Platelet count.
    pub platelet_count: Option<f64>,
    /// Mean corpuscular volume.
    pub mean_corpuscular_volume: Option<f64>,
    /// Mean corpuscular hemoglobin.
    pub mean_corpuscular_hemoglobin: Option<f64>,
    /// Red cell distribution width.
    pub red_cell_distribution_width: Option<f64>,
}

// ─── Coagulation Studies (Step 3) ───────────────────────────

/// Coagulation studies.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CoagulationStudies {
    /// Prothrombin time.
    pub prothrombin_time: Option<f64>,
    /// Inr.
    pub inr: Option<f64>,
    /// Activated partial thromboplastin time.
    pub activated_partial_thromboplastin_time: Option<f64>,
    /// Fibrinogen.
    pub fibrinogen: Option<f64>,
    /// D dimer.
    pub d_dimer: Option<f64>,
    /// Bleeding time.
    pub bleeding_time: Option<f64>,
}

// ─── Peripheral Blood Film (Step 4) ─────────────────────────

/// Peripheral blood film.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PeripheralBloodFilm {
    /// Red cell morphology.
    pub red_cell_morphology: String,
    /// White blood cell differential.
    pub white_blood_cell_differential: String,
    /// Platelet morphology.
    pub platelet_morphology: String,
    /// Abnormal cell morphology.
    pub abnormal_cell_morphology: String,
    /// Film quality.
    pub film_quality: Option<u8>,
    /// Film comments.
    pub film_comments: String,
}

// ─── Iron Studies (Step 5) ──────────────────────────────────

/// Iron studies.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct IronStudies {
    /// Serum iron.
    pub serum_iron: Option<f64>,
    /// Total iron binding capacity.
    pub total_iron_binding_capacity: Option<f64>,
    /// Transferrin saturation.
    pub transferrin_saturation: Option<f64>,
    /// Serum ferritin.
    pub serum_ferritin: Option<f64>,
    /// Reticulocyte count.
    pub reticulocyte_count: Option<f64>,
}

// ─── Hemoglobinopathy Screening (Step 6) ────────────────────

/// Hemoglobinopathy screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HemoglobinopathyScreening {
    /// Hemoglobin electrophoresis.
    pub hemoglobin_electrophoresis: String,
    /// Sickle cell screen.
    pub sickle_cell_screen: String,
    /// Thalassemia screen.
    pub thalassemia_screen: String,
    /// Hplc results.
    pub hplc_results: String,
    /// Genetic testing notes.
    pub genetic_testing_notes: String,
}

// ─── Bone Marrow Assessment (Step 7) ────────────────────────

/// Bone marrow assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BoneMarrowAssessment {
    /// Aspirate findings.
    pub aspirate_findings: String,
    /// Biopsy findings.
    pub biopsy_findings: String,
    /// Cellularity.
    pub cellularity: Option<u8>,
    /// Cytogenetics results.
    pub cytogenetics_results: String,
    /// Flow cytometry results.
    pub flow_cytometry_results: String,
    /// Bone marrow comments.
    pub bone_marrow_comments: String,
}

// ─── Transfusion History (Step 8) ───────────────────────────

/// Transfusion history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TransfusionHistory {
    /// Previous transfusions.
    pub previous_transfusions: String,
    /// Transfusion reactions.
    pub transfusion_reactions: String,
    /// Blood group type.
    pub blood_group_type: String,
    /// Antibody screen.
    pub antibody_screen: String,
    /// Crossmatch results.
    pub crossmatch_results: String,
}

// ─── Treatment & Medications (Step 9) ───────────────────────

/// Treatment medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentMedications {
    /// Current medications.
    pub current_medications: String,
    /// Chemotherapy regimen.
    pub chemotherapy_regimen: String,
    /// Anticoagulant therapy.
    pub anticoagulant_therapy: String,
    /// Iron therapy.
    pub iron_therapy: String,
    /// Treatment response.
    pub treatment_response: String,
    /// Adverse effects.
    pub adverse_effects: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinical summary.
    pub clinical_summary: String,
    /// Diagnosis.
    pub diagnosis: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Urgency level.
    pub urgency_level: Option<u8>,
    /// Reviewer name.
    pub reviewer_name: String,
    /// Review date.
    pub review_date: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Blood count analysis.
    pub blood_count_analysis: BloodCountAnalysis,
    /// Coagulation studies.
    pub coagulation_studies: CoagulationStudies,
    /// Peripheral blood film.
    pub peripheral_blood_film: PeripheralBloodFilm,
    /// Iron studies.
    pub iron_studies: IronStudies,
    /// Hemoglobinopathy screening.
    pub hemoglobinopathy_screening: HemoglobinopathyScreening,
    /// Bone marrow assessment.
    pub bone_marrow_assessment: BoneMarrowAssessment,
    /// Transfusion history.
    pub transfusion_history: TransfusionHistory,
    /// Treatment medications.
    pub treatment_medications: TreatmentMedications,
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
    /// Abnormality level.
    pub abnormality_level: AbnormalityLevel,
    /// Abnormality score.
    pub abnormality_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
