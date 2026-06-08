//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<f64>` / `Option<i32>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Smoking status.
pub type SmokingStatus = String; // 'current' | 'ex' | 'never' | ''
/// Sex.
pub type Sex = String; // 'male' | 'female' | 'other' | ''
/// Gfr category.
pub type GfrCategory = String; // 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | ''
/// Albuminuria category.
pub type AlbuminuriaCategory = String; // 'A1' | 'A2' | 'A3' | ''
/// Risk level.
pub type RiskLevel = String; // 'low' | 'moderate' | 'high' | 'very-high' | 'unknown'

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
    /// Ethnicity.
    pub ethnicity: String,
    /// Age.
    pub age: Option<i32>,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
}

/// Step 2 — Presenting Symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSymptoms {
    /// Fatigue.
    pub fatigue: YesNo,
    /// Edema.
    pub edema: YesNo,
    /// Foamy urine.
    pub foamy_urine: YesNo,
    /// Nocturia.
    pub nocturia: YesNo,
    /// Hematuria.
    pub hematuria: YesNo,
    /// Flank pain.
    pub flank_pain: YesNo,
    /// Reduced urine output.
    pub reduced_urine_output: YesNo,
    /// Pruritus.
    pub pruritus: YesNo,
    /// Nausea vomiting.
    pub nausea_vomiting: YesNo,
    /// Appetite loss.
    pub appetite_loss: YesNo,
    /// Dyspnea.
    pub dyspnea: YesNo,
    /// Confusion.
    pub confusion: YesNo,
    /// Symptom duration.
    pub symptom_duration: String,
    /// Other symptoms.
    pub other_symptoms: String,
}

/// Step 3 — CKD Risk Factors.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CkdRiskFactors {
    /// Hypertension.
    pub hypertension: YesNo,
    /// Diabetes.
    pub diabetes: YesNo,
    /// Diabetes type.
    pub diabetes_type: String,
    /// Cardiovascular disease.
    pub cardiovascular_disease: YesNo,
    /// Family history ckd.
    pub family_history_ckd: YesNo,
    /// Family history polycystic kidney.
    pub family_history_polycystic_kidney: YesNo,
    /// Prior aki.
    pub prior_aki: YesNo,
    /// Kidney stones.
    pub kidney_stones: YesNo,
    /// Recurrent uti.
    pub recurrent_uti: YesNo,
    /// Autoimmune disease.
    pub autoimmune_disease: YesNo,
    /// Autoimmune details.
    pub autoimmune_details: String,
    /// Nephrotoxic drugs.
    pub nephrotoxic_drugs: YesNo,
    /// Nephrotoxic drug details.
    pub nephrotoxic_drug_details: String,
    /// Nsaid use.
    pub nsaid_use: YesNo,
    /// Smoking.
    pub smoking: SmokingStatus,
    /// Obesity.
    pub obesity: YesNo,
}

/// Step 4 — Physical Examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    /// Systolic BP.
    pub systolic_bp: Option<i32>,
    /// Diastolic BP.
    pub diastolic_bp: Option<i32>,
    /// Heart rate.
    pub heart_rate: Option<i32>,
    /// Peripheral edema.
    pub peripheral_edema: YesNo,
    /// Pulmonary edema.
    pub pulmonary_edema: YesNo,
    /// Jvd elevated.
    pub jvd_elevated: YesNo,
    /// Pallor.
    pub pallor: YesNo,
    /// Uremic skin.
    pub uremic_skin: YesNo,
    /// Flank tenderness.
    pub flank_tenderness: YesNo,
    /// Palpable kidneys.
    pub palpable_kidneys: YesNo,
    /// Bladder distension.
    pub bladder_distension: YesNo,
    /// Exam notes.
    pub exam_notes: String,
}

/// Step 5 — Blood Tests.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BloodTests {
    /// Serum creatinine.
    pub serum_creatinine: Option<f64>,
    /// Egfr.
    pub egfr: Option<f64>,
    /// Bun.
    pub bun: Option<f64>,
    /// Sodium.
    pub sodium: Option<f64>,
    /// Potassium.
    pub potassium: Option<f64>,
    /// Chloride.
    pub chloride: Option<f64>,
    /// Bicarbonate.
    pub bicarbonate: Option<f64>,
    /// Calcium.
    pub calcium: Option<f64>,
    /// Phosphate.
    pub phosphate: Option<f64>,
    /// Magnesium.
    pub magnesium: Option<f64>,
    /// Albumin.
    pub albumin: Option<f64>,
    /// Hemoglobin.
    pub hemoglobin: Option<f64>,
    /// Hba1c.
    pub hba1c: Option<f64>,
    /// Pth.
    pub pth: Option<f64>,
    /// Vitamin d.
    pub vitamin_d: Option<f64>,
    /// Test date.
    pub test_date: String,
}

/// Step 6 — Urine Tests.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrineTests {
    /// Acr.
    pub acr: Option<f64>,
    /// Pcr.
    pub pcr: Option<f64>,
    /// Dipstick protein.
    pub dipstick_protein: String,
    /// Dipstick blood.
    pub dipstick_blood: String,
    /// Dipstick glucose.
    pub dipstick_glucose: String,
    /// Dipstick leukocytes.
    pub dipstick_leukocytes: String,
    /// Dipstick nitrites.
    pub dipstick_nitrites: String,
    /// Microscopy casts.
    pub microscopy_casts: YesNo,
    /// Cast type.
    pub cast_type: String,
    /// Test date.
    pub test_date: String,
}

/// Step 7 — Imaging & Biopsy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImagingBiopsy {
    /// Renal ultrasound done.
    pub renal_ultrasound_done: YesNo,
    /// Ultrasound findings.
    pub ultrasound_findings: String,
    /// Right kidney length mm.
    pub right_kidney_length_mm: Option<i32>,
    /// Left kidney length mm.
    pub left_kidney_length_mm: Option<i32>,
    /// Cysts.
    pub cysts: YesNo,
    /// Hydronephrosis.
    pub hydronephrosis: YesNo,
    /// Stones.
    pub stones: YesNo,
    /// CT or MRI.
    pub ct_or_mri: YesNo,
    /// CT MRI findings.
    pub ct_mri_findings: String,
    /// Biopsy done.
    pub biopsy_done: YesNo,
    /// Biopsy result.
    pub biopsy_result: String,
    /// Biopsy date.
    pub biopsy_date: String,
}

/// A single medication entry within the medication review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
}

/// Step 8 — Medication Review & Dose Adjustment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationReview {
    /// Current medications.
    pub current_medications: Vec<Medication>,
    /// Acei arb.
    pub acei_arb: YesNo,
    /// Sglt2 inhibitor.
    pub sglt2_inhibitor: YesNo,
    /// Diuretic.
    pub diuretic: YesNo,
    /// Statin.
    pub statin: YesNo,
    /// Phosphate binder.
    pub phosphate_binder: YesNo,
    /// Erythropoietin agent.
    pub erythropoietin_agent: YesNo,
    /// Dose adjustments needed.
    pub dose_adjustments_needed: YesNo,
    /// Dose adjustment details.
    pub dose_adjustment_details: String,
    /// Contrast imaging planned.
    pub contrast_imaging_planned: YesNo,
    /// Medication notes.
    pub medication_notes: String,
}

/// Step 9 — Clinical Impression & KDIGO Stage.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpression {
    /// Gfr category.
    pub gfr_category: GfrCategory,
    /// Albuminuria category.
    pub albuminuria_category: AlbuminuriaCategory,
    /// Suspected etiology.
    pub suspected_etiology: String,
    /// Aksuperimposed on ckd.
    pub aksuperimposed_on_ckd: YesNo,
    /// Nephrology referral.
    pub nephrology_referral: YesNo,
    /// Referral urgency.
    pub referral_urgency: String,
    /// Dialysis discussion needed.
    pub dialysis_discussion_needed: YesNo,
    /// Transplant candidate.
    pub transplant_candidate: YesNo,
    /// Management plan.
    pub management_plan: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Clinician notes.
    pub clinician_notes: String,
}

/// Full renal-assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Presenting symptoms.
    pub presenting_symptoms: PresentingSymptoms,
    /// Ckd risk factors.
    pub ckd_risk_factors: CkdRiskFactors,
    /// Physical examination.
    pub physical_examination: PhysicalExamination,
    /// Blood tests.
    pub blood_tests: BloodTests,
    /// Urine tests.
    pub urine_tests: UrineTests,
    /// Imaging biopsy.
    pub imaging_biopsy: ImagingBiopsy,
    /// Medication review.
    pub medication_review: MedicationReview,
    /// Clinical impression.
    pub clinical_impression: ClinicalImpression,
}

/// A KDIGO rule that produced a non-empty audit-trail value.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Value.
    pub value: String,
}

/// A safety flag detected independently of the KDIGO classification.
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
    pub priority: String, // 'urgent' | 'high' | 'medium' | 'low'
}

/// Grading output for a renal assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Gfr category.
    pub gfr_category: GfrCategory,
    /// Albuminuria category.
    pub albuminuria_category: AlbuminuriaCategory,
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Egfr.
    pub egfr: Option<f64>,
    /// Acr.
    pub acr: Option<f64>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
