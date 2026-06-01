use serde::{Deserialize, Serialize};

// Type aliases for the form's enum and yes/no string unions.
// Empty string `''` indicates an unanswered text / enum field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;

/// UK MEC category 1-4.
pub type MECCategory = u8;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
}

/// Step 2 — Menstrual history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistory {
    pub menarche_age: Option<i32>,
    pub cycle_regularity: String,
    pub cycle_length_days: Option<i32>,
    pub period_duration_days: Option<i32>,
    pub flow_heaviness: String,
    pub intermenstrual_bleeding: YesNo,
    pub postcoital_bleeding: YesNo,
    pub dysmenorrhoea: String,
    pub last_menstrual_period: String,
    pub amenorrhoea: YesNo,
    pub amenorrhoea_duration_months: Option<i32>,
}

/// Step 3 — Contraceptive history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContraceptiveHistory {
    pub previous_contraception: YesNo,
    #[serde(rename = "previousCOC")]
    pub previous_coc: YesNo,
    pub coc_details: String,
    #[serde(rename = "previousPOP")]
    pub previous_pop: YesNo,
    pub pop_details: String,
    pub previous_implant: YesNo,
    pub implant_details: String,
    pub previous_injection: YesNo,
    pub injection_details: String,
    #[serde(rename = "previousIUD")]
    pub previous_iud: YesNo,
    pub iud_details: String,
    #[serde(rename = "previousIUS")]
    pub previous_ius: YesNo,
    pub ius_details: String,
    pub previous_patch_ring: YesNo,
    pub patch_ring_details: String,
    pub previous_barrier: YesNo,
    pub reason_for_change: String,
    pub adverse_effects: String,
}

/// Step 4 — Medical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    pub migraine: YesNo,
    pub migraine_with_aura: YesNo,
    pub migraine_frequency: String,
    pub breast_cancer: String,
    pub cervical_cancer: YesNo,
    pub liver_disease: String,
    pub gallbladder_disease: YesNo,
    pub inflammatory_bowel_disease: YesNo,
    pub sle: YesNo,
    pub sle_antiphospholipid: YesNo,
    pub epilepsy: YesNo,
    pub diabetes: String,
    pub diabetes_complications: YesNo,
    pub sti: YesNo,
    pub sti_details: String,
    pub pid: YesNo,
}

/// Step 5 — Cardiovascular risk.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularRisk {
    pub hypertension: YesNo,
    #[serde(rename = "systolicBP")]
    pub systolic_bp: Option<i32>,
    #[serde(rename = "diastolicBP")]
    pub diastolic_bp: Option<i32>,
    pub bp_controlled: YesNo,
    pub ischaemic_heart_disease: YesNo,
    pub stroke_history: YesNo,
    pub valvular_heart_disease: YesNo,
    pub valvular_complications: YesNo,
    pub hyperlipidaemia: YesNo,
    #[serde(rename = "familyHistoryVTE")]
    pub family_history_vte: YesNo,
    #[serde(rename = "familyHistoryCVD")]
    pub family_history_cvd: YesNo,
    #[serde(rename = "familyCVDDetails")]
    pub family_cvd_details: String,
}

/// Step 6 — Thromboembolism risk.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThromboembolismRisk {
    #[serde(rename = "previousDVT")]
    pub previous_dvt: YesNo,
    pub dvt_details: String,
    #[serde(rename = "previousPE")]
    pub previous_pe: YesNo,
    pub pe_details: String,
    pub known_thrombophilia: YesNo,
    pub thrombophilia_type: String,
    pub immobility_risk: YesNo,
    pub immobility_details: String,
    pub recent_major_surgery: YesNo,
    pub surgery_details: String,
    pub long_haul_travel: YesNo,
}

/// Step 7 — Current medications.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    pub enzyme_inducing_drugs: YesNo,
    pub enzyme_inducing_details: String,
    pub anticoagulants: YesNo,
    pub anticoagulant_details: String,
    pub antiepileptics: YesNo,
    pub antiepileptic_details: String,
    pub antiretrovirals: YesNo,
    pub antiretroviral_details: String,
    pub antibiotics: YesNo,
    pub antibiotic_details: String,
    pub ssri_snri: YesNo,
    pub ssri_snri_details: String,
    pub herbal_remedies: YesNo,
    pub herbal_details: String,
    pub other_medications: String,
    pub drug_allergies: YesNo,
    pub drug_allergy_details: String,
}

/// Step 8 — Lifestyle assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleAssessment {
    pub smoking: String,
    pub cigarettes_per_day: Option<i32>,
    pub age_over_35_smoker: YesNo,
    pub alcohol: String,
    pub alcohol_units_per_week: Option<i32>,
    pub recreational_drug_use: YesNo,
    pub recreational_drug_details: String,
    pub exercise_frequency: String,
    pub sexual_activity: YesNo,
    pub number_of_partners: String,
}

/// Step 9 — Contraceptive preferences.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContraceptivePreferences {
    pub preferred_method: String,
    pub hormonal_acceptable: YesNo,
    pub long_acting_acceptable: YesNo,
    pub daily_pill_acceptable: YesNo,
    pub intrauterine_acceptable: YesNo,
    pub fertility_plans: String,
    pub breastfeeding: YesNo,
    pub postpartum_weeks: Option<i32>,
    pub concerns: String,
}

/// Step 10 — Clinical recommendation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalRecommendation {
    pub clinical_notes: String,
}

/// Full birth-control-assessment data model.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub menstrual_history: MenstrualHistory,
    pub contraceptive_history: ContraceptiveHistory,
    pub medical_history: MedicalHistory,
    pub cardiovascular_risk: CardiovascularRisk,
    pub thromboembolism_risk: ThromboembolismRisk,
    pub current_medications: CurrentMedications,
    pub lifestyle_assessment: LifestyleAssessment,
    pub contraceptive_preferences: ContraceptivePreferences,
    pub clinical_recommendation: ClinicalRecommendation,
}

/// Per-method UK MEC categories for the six contraceptive methods.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MethodMEC {
    pub coc: MECCategory,
    pub pop: MECCategory,
    pub implant: MECCategory,
    pub injection: MECCategory,
    pub iud: MECCategory,
    pub ius: MECCategory,
}

impl Default for MethodMEC {
    fn default() -> Self {
        Self {
            coc: 1,
            pop: 1,
            implant: 1,
            injection: 1,
            iud: 1,
            ius: 1,
        }
    }
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub mec_category: u8,
    pub affected_methods: Vec<String>,
}

/// A safety flag computed independently of grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a birth-control assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub method_mec: MethodMEC,
    pub overall_risk: String,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
