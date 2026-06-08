//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Eligibility level.
pub type EligibilityLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Age.
    pub age: Option<u8>,
    /// Sex.
    pub sex: String,
    /// NHS number.
    pub nhs_number: String,
    /// Consultation date.
    pub consultation_date: String,
    /// Clinician name.
    pub clinician_name: String,
}

// ─── Reproductive History (Step 2) ──────────────────────────

/// Reproductive history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReproductiveHistory {
    /// Parity.
    pub parity: Option<u8>,
    /// Last delivery date.
    pub last_delivery_date: String,
    /// Pregnancy possible.
    pub pregnancy_possible: String,
    /// Breastfeeding.
    pub breastfeeding: String,
    /// Breastfeeding duration.
    pub breastfeeding_duration: String,
    /// Ectopic history.
    pub ectopic_history: String,
    /// Current sti risk.
    pub current_sti_risk: String,
    /// Last sti screen date.
    pub last_sti_screen_date: String,
}

// ─── Medical History (Step 3) ───────────────────────────────

/// Medical history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Vte history.
    pub vte_history: String,
    /// Vte family history.
    pub vte_family_history: String,
    /// Stroke history.
    pub stroke_history: String,
    /// Ischaemic heart disease.
    pub ischaemic_heart_disease: String,
    /// Valvular heart disease.
    pub valvular_heart_disease: String,
    /// Diabetes type.
    pub diabetes_type: String,
    /// Diabetes complications.
    pub diabetes_complications: String,
    /// Liver disease.
    pub liver_disease: String,
    /// Gallbladder disease.
    pub gallbladder_disease: String,
    /// Inflammatory bowel disease.
    pub inflammatory_bowel_disease: String,
    /// Sle with antiphospholipid.
    pub sle_with_antiphospholipid: String,
    /// Breast cancer history.
    pub breast_cancer_history: String,
    /// Breast cancer current.
    pub breast_cancer_current: String,
    /// Cervical cancer.
    pub cervical_cancer: String,
    /// Endometrial cancer.
    pub endometrial_cancer: String,
    /// Epilepsy.
    pub epilepsy: String,
}

// ─── Cardiovascular Risk (Step 4) ───────────────────────────

/// Cardiovascular risk.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularRisk {
    /// Systolic BP.
    pub systolic_bp: Option<u16>,
    /// Diastolic BP.
    pub diastolic_bp: Option<u16>,
    /// Hypertension controlled.
    pub hypertension_controlled: String,
    /// Migraine with aura.
    pub migraine_with_aura: String,
    /// Migraine without aura.
    pub migraine_without_aura: String,
    /// Migraine age over 35.
    pub migraine_age_over_35: String,
    /// Multiple cv risk factors.
    pub multiple_cv_risk_factors: String,
}

// ─── Current Medications (Step 5) ───────────────────────────

/// Current medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// Anticonvulsants.
    pub anticonvulsants: String,
    /// Anticonvulsant names.
    pub anticonvulsant_names: String,
    /// Rifampicin rifabutin.
    pub rifampicin_rifabutin: String,
    /// Antiretrovirals.
    pub antiretrovirals: String,
    /// Ssri antidepressants.
    pub ssri_antidepressants: String,
    /// Anticoagulants.
    pub anticoagulants: String,
    /// Other medications.
    pub other_medications: String,
}

// ─── Smoking & BMI (Step 6) ─────────────────────────────────

/// Smoking BMI.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SmokingBmi {
    /// Smoking status.
    pub smoking_status: String,
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<u8>,
    /// Age over 35 smoking.
    pub age_over_35_smoking: String,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// BMI over 35.
    pub bmi_over_35: String,
}

// ─── Contraceptive Preferences (Step 7) ─────────────────────

/// Contraceptive preferences.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ContraceptivePreferences {
    /// Current method.
    pub current_method: String,
    /// Reason for change.
    pub reason_for_change: String,
    /// Preferred method.
    pub preferred_method: String,
    /// Long acting interest.
    pub long_acting_interest: String,
    /// Hormonal concerns.
    pub hormonal_concerns: String,
    /// Fertility plans.
    pub fertility_plans: String,
    /// Partner involvement.
    pub partner_involvement: String,
}

// ─── UKMEC Eligibility (Step 8) ─────────────────────────────

/// Ukmec eligibility.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UkmecEligibility {
    /// Coc category.
    pub coc_category: Option<u8>,
    /// Pop category.
    pub pop_category: Option<u8>,
    /// Patch ring category.
    pub patch_ring_category: Option<u8>,
    /// Dmpa injectable category.
    pub dmpa_injectable_category: Option<u8>,
    /// Implant category.
    pub implant_category: Option<u8>,
    /// Lng ius category.
    pub lng_ius_category: Option<u8>,
    /// Cu iud category.
    pub cu_iud_category: Option<u8>,
    /// Barrier category.
    pub barrier_category: Option<u8>,
    /// Clinician override notes.
    pub clinician_override_notes: String,
}

// ─── Counselling (Step 9) ───────────────────────────────────

/// Counselling.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Counselling {
    /// Method explained.
    pub method_explained: String,
    /// Risks benefits discussed.
    pub risks_benefits_discussed: String,
    /// Side effects discussed.
    pub side_effects_discussed: String,
    /// Alternative methods discussed.
    pub alternative_methods_discussed: String,
    /// Sti prevention discussed.
    pub sti_prevention_discussed: String,
    /// Emergency contraception discussed.
    pub emergency_contraception_discussed: String,
    /// Written information provided.
    pub written_information_provided: String,
    /// Patient questions answered.
    pub patient_questions_answered: String,
    /// Consent obtained.
    pub consent_obtained: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Method chosen.
    pub method_chosen: String,
    /// Prescription issued.
    pub prescription_issued: String,
    /// Follow up date.
    pub follow_up_date: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Cervical screening status.
    pub cervical_screening_status: String,
    /// Last cervical screen date.
    pub last_cervical_screen_date: String,
    /// Additional investigations.
    pub additional_investigations: String,
    /// Clinician notes.
    pub clinician_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Reproductive history.
    pub reproductive_history: ReproductiveHistory,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Cardiovascular risk.
    pub cardiovascular_risk: CardiovascularRisk,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Smoking BMI.
    pub smoking_bmi: SmokingBmi,
    /// Contraceptive preferences.
    pub contraceptive_preferences: ContraceptivePreferences,
    /// Ukmec eligibility.
    pub ukmec_eligibility: UkmecEligibility,
    /// Counselling.
    pub counselling: Counselling,
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
    /// Eligibility level.
    pub eligibility_level: EligibilityLevel,
    /// Ukmec category.
    pub ukmec_category: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
