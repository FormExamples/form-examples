//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Severity level.
pub type SeverityLevel = String;

// ─── Patient Information (Step 1) ──────────────────────────

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
    /// Referring physician.
    pub referring_physician: String,
    /// Referral date.
    pub referral_date: String,
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Visit type.
    pub visit_type: String,
}

// ─── GI History (Step 2) ───────────────────────────────────

/// Gi history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GiHistory {
    /// Previous gi conditions.
    pub previous_gi_conditions: String,
    /// Family cancer history.
    pub family_cancer_history: String,
    /// Family cancer details.
    pub family_cancer_details: String,
    /// Family ibd history.
    pub family_ibd_history: String,
    /// Previous endoscopy.
    pub previous_endoscopy: String,
    /// Previous endoscopy date.
    pub previous_endoscopy_date: String,
    /// Previous endoscopy findings.
    pub previous_endoscopy_findings: String,
    /// Surgical history.
    pub surgical_history: String,
}

// ─── Upper GI Symptoms (Step 3) ────────────────────────────

/// Upper gi symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UpperGiSymptoms {
    /// Heartburn frequency.
    pub heartburn_frequency: Option<u8>,
    /// Heartburn severity.
    pub heartburn_severity: Option<u8>,
    /// Dysphagia grade.
    pub dysphagia_grade: Option<u8>,
    /// Odynophagia.
    pub odynophagia: String,
    /// Nausea frequency.
    pub nausea_frequency: Option<u8>,
    /// Vomiting frequency.
    pub vomiting_frequency: Option<u8>,
    /// Early satiety.
    pub early_satiety: Option<u8>,
    /// Epigastric pain.
    pub epigastric_pain: Option<u8>,
}

// ─── Lower GI Symptoms (Step 4) ────────────────────────────

/// Lower gi symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LowerGiSymptoms {
    /// Bowel habit change.
    pub bowel_habit_change: String,
    /// Stool frequency.
    pub stool_frequency: String,
    /// Stool consistency.
    pub stool_consistency: String,
    /// Rectal bleeding.
    pub rectal_bleeding: String,
    /// Rectal bleeding frequency.
    pub rectal_bleeding_frequency: Option<u8>,
    /// Abdominal pain severity.
    pub abdominal_pain_severity: Option<u8>,
    /// Bloating severity.
    pub bloating_severity: Option<u8>,
    /// Tenesmus.
    pub tenesmus: String,
    /// Nocturnal symptoms.
    pub nocturnal_symptoms: String,
}

// ─── Alarm Features (Step 5) ───────────────────────────────

/// Alarm features.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AlarmFeatures {
    /// Unintentional weight loss.
    pub unintentional_weight_loss: String,
    /// Weight loss percentage.
    pub weight_loss_percentage: Option<f64>,
    /// Weight loss duration.
    pub weight_loss_duration: String,
    /// Dysphagia present.
    pub dysphagia_present: String,
    /// Gi bleeding.
    pub gi_bleeding: String,
    /// Gi bleeding type.
    pub gi_bleeding_type: String,
    /// Iron deficiency anaemia.
    pub iron_deficiency_anaemia: String,
    /// Palpable mass.
    pub palpable_mass: String,
    /// Jaundice.
    pub jaundice: String,
    /// Fever unexplained.
    pub fever_unexplained: String,
    /// Age over 50 new symptoms.
    pub age_over_50_new_symptoms: String,
}

// ─── Nutritional Assessment (Step 6) ───────────────────────

/// Nutritional assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct NutritionalAssessment {
    /// Current weight kg.
    pub current_weight_kg: Option<f64>,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Albumin g l.
    pub albumin_g_l: Option<f64>,
    /// Appetite change.
    pub appetite_change: String,
    /// Dietary restrictions.
    pub dietary_restrictions: String,
    /// Nutritional supplements.
    pub nutritional_supplements: String,
    /// Must screening score.
    pub must_screening_score: Option<u8>,
}

// ─── Liver Assessment (Step 7) ─────────────────────────────

/// Liver assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LiverAssessment {
    /// Alt u l.
    pub alt_u_l: Option<f64>,
    /// Ast u l.
    pub ast_u_l: Option<f64>,
    /// Alp u l.
    pub alp_u_l: Option<f64>,
    /// Bilirubin umol l.
    pub bilirubin_umol_l: Option<f64>,
    /// Ggt u l.
    pub ggt_u_l: Option<f64>,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<u8>,
    /// Liver symptoms.
    pub liver_symptoms: String,
    /// Ascites.
    pub ascites: String,
    /// Hepatomegaly.
    pub hepatomegaly: String,
}

// ─── Investigations (Step 8) ───────────────────────────────

/// Investigations.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    /// H pylori test.
    pub h_pylori_test: String,
    /// H pylori result.
    pub h_pylori_result: String,
    /// Coeliac screen.
    pub coeliac_screen: String,
    /// Coeliac result.
    pub coeliac_result: String,
    /// Faecal calprotectin.
    pub faecal_calprotectin: String,
    /// Faecal calprotectin result.
    pub faecal_calprotectin_result: String,
    /// Imaging performed.
    pub imaging_performed: String,
    /// Imaging findings.
    pub imaging_findings: String,
    /// Endoscopy needed.
    pub endoscopy_needed: String,
    /// Endoscopy urgency.
    pub endoscopy_urgency: String,
}

// ─── Current Treatment (Step 9) ────────────────────────────

/// Current treatment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentTreatment {
    /// Ppi use.
    pub ppi_use: String,
    /// Ppi duration.
    pub ppi_duration: String,
    /// Antacid use.
    pub antacid_use: String,
    /// Laxative use.
    pub laxative_use: String,
    /// Antidiarrhoeal use.
    pub antidiarrhoeal_use: String,
    /// Immunosuppressant use.
    pub immunosuppressant_use: String,
    /// Biologic therapy.
    pub biologic_therapy: String,
    /// Nsaid use.
    pub nsaid_use: String,
    /// Anticoagulant use.
    pub anticoagulant_use: String,
    /// Other medications.
    pub other_medications: String,
}

// ─── Clinical Review (Step 10) ─────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Ibd activity index.
    pub ibd_activity_index: Option<u8>,
    /// Symptom duration weeks.
    pub symptom_duration_weeks: String,
    /// Quality of life impact.
    pub quality_of_life_impact: Option<u8>,
    /// Work days missed.
    pub work_days_missed: String,
    /// Mental health impact.
    pub mental_health_impact: String,
    /// Smoking status.
    pub smoking_status: String,
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
    /// Gi history.
    pub gi_history: GiHistory,
    /// Upper gi symptoms.
    pub upper_gi_symptoms: UpperGiSymptoms,
    /// Lower gi symptoms.
    pub lower_gi_symptoms: LowerGiSymptoms,
    /// Alarm features.
    pub alarm_features: AlarmFeatures,
    /// Nutritional assessment.
    pub nutritional_assessment: NutritionalAssessment,
    /// Liver assessment.
    pub liver_assessment: LiverAssessment,
    /// Investigations.
    pub investigations: Investigations,
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
