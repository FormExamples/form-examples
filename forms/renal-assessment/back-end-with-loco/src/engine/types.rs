use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type SmokingStatus = String; // 'current' | 'ex' | 'never' | ''
pub type Sex = String; // 'male' | 'female' | 'other' | ''
pub type GfrCategory = String; // 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | ''
pub type AlbuminuriaCategory = String; // 'A1' | 'A2' | 'A3' | ''
pub type RiskLevel = String; // 'low' | 'moderate' | 'high' | 'very-high' | 'unknown'

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub ethnicity: String,
    pub age: Option<i32>,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
}

/// Step 2 — Presenting Symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSymptoms {
    pub fatigue: YesNo,
    pub edema: YesNo,
    pub foamy_urine: YesNo,
    pub nocturia: YesNo,
    pub hematuria: YesNo,
    pub flank_pain: YesNo,
    pub reduced_urine_output: YesNo,
    pub pruritus: YesNo,
    pub nausea_vomiting: YesNo,
    pub appetite_loss: YesNo,
    pub dyspnea: YesNo,
    pub confusion: YesNo,
    pub symptom_duration: String,
    pub other_symptoms: String,
}

/// Step 3 — CKD Risk Factors.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CkdRiskFactors {
    pub hypertension: YesNo,
    pub diabetes: YesNo,
    pub diabetes_type: String,
    pub cardiovascular_disease: YesNo,
    pub family_history_ckd: YesNo,
    pub family_history_polycystic_kidney: YesNo,
    pub prior_aki: YesNo,
    pub kidney_stones: YesNo,
    pub recurrent_uti: YesNo,
    pub autoimmune_disease: YesNo,
    pub autoimmune_details: String,
    pub nephrotoxic_drugs: YesNo,
    pub nephrotoxic_drug_details: String,
    pub nsaid_use: YesNo,
    pub smoking: SmokingStatus,
    pub obesity: YesNo,
}

/// Step 4 — Physical Examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub heart_rate: Option<i32>,
    pub peripheral_edema: YesNo,
    pub pulmonary_edema: YesNo,
    pub jvd_elevated: YesNo,
    pub pallor: YesNo,
    pub uremic_skin: YesNo,
    pub flank_tenderness: YesNo,
    pub palpable_kidneys: YesNo,
    pub bladder_distension: YesNo,
    pub exam_notes: String,
}

/// Step 5 — Blood Tests.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BloodTests {
    pub serum_creatinine: Option<f64>,
    pub egfr: Option<f64>,
    pub bun: Option<f64>,
    pub sodium: Option<f64>,
    pub potassium: Option<f64>,
    pub chloride: Option<f64>,
    pub bicarbonate: Option<f64>,
    pub calcium: Option<f64>,
    pub phosphate: Option<f64>,
    pub magnesium: Option<f64>,
    pub albumin: Option<f64>,
    pub hemoglobin: Option<f64>,
    pub hba1c: Option<f64>,
    pub pth: Option<f64>,
    pub vitamin_d: Option<f64>,
    pub test_date: String,
}

/// Step 6 — Urine Tests.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrineTests {
    pub acr: Option<f64>,
    pub pcr: Option<f64>,
    pub dipstick_protein: String,
    pub dipstick_blood: String,
    pub dipstick_glucose: String,
    pub dipstick_leukocytes: String,
    pub dipstick_nitrites: String,
    pub microscopy_casts: YesNo,
    pub cast_type: String,
    pub test_date: String,
}

/// Step 7 — Imaging & Biopsy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImagingBiopsy {
    pub renal_ultrasound_done: YesNo,
    pub ultrasound_findings: String,
    pub right_kidney_length_mm: Option<i32>,
    pub left_kidney_length_mm: Option<i32>,
    pub cysts: YesNo,
    pub hydronephrosis: YesNo,
    pub stones: YesNo,
    pub ct_or_mri: YesNo,
    pub ct_mri_findings: String,
    pub biopsy_done: YesNo,
    pub biopsy_result: String,
    pub biopsy_date: String,
}

/// A single medication entry within the medication review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub dose: String,
    pub frequency: String,
}

/// Step 8 — Medication Review & Dose Adjustment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationReview {
    pub current_medications: Vec<Medication>,
    pub acei_arb: YesNo,
    pub sglt2_inhibitor: YesNo,
    pub diuretic: YesNo,
    pub statin: YesNo,
    pub phosphate_binder: YesNo,
    pub erythropoietin_agent: YesNo,
    pub dose_adjustments_needed: YesNo,
    pub dose_adjustment_details: String,
    pub contrast_imaging_planned: YesNo,
    pub medication_notes: String,
}

/// Step 9 — Clinical Impression & KDIGO Stage.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpression {
    pub gfr_category: GfrCategory,
    pub albuminuria_category: AlbuminuriaCategory,
    pub suspected_etiology: String,
    pub aksuperimposed_on_ckd: YesNo,
    pub nephrology_referral: YesNo,
    pub referral_urgency: String,
    pub dialysis_discussion_needed: YesNo,
    pub transplant_candidate: YesNo,
    pub management_plan: String,
    pub follow_up_interval: String,
    pub clinician_notes: String,
}

/// Full renal-assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub presenting_symptoms: PresentingSymptoms,
    pub ckd_risk_factors: CkdRiskFactors,
    pub physical_examination: PhysicalExamination,
    pub blood_tests: BloodTests,
    pub urine_tests: UrineTests,
    pub imaging_biopsy: ImagingBiopsy,
    pub medication_review: MedicationReview,
    pub clinical_impression: ClinicalImpression,
}

/// A KDIGO rule that produced a non-empty audit-trail value.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub value: String,
}

/// A safety flag detected independently of the KDIGO classification.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String, // 'urgent' | 'high' | 'medium' | 'low'
}

/// Grading output for a renal assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub gfr_category: GfrCategory,
    pub albuminuria_category: AlbuminuriaCategory,
    pub risk_level: RiskLevel,
    pub egfr: Option<f64>,
    pub acr: Option<f64>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
