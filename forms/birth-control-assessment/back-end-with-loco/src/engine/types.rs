//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases for the form's enum and yes/no string unions.
// Empty string `''` indicates an unanswered text / enum field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;

/// UK MEC category 1-4.
pub type MECCategory = u8;

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
    pub sex: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
}

/// Step 2 — Menstrual history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistory {
    /// Menarche age.
    pub menarche_age: Option<i32>,
    /// Cycle regularity.
    pub cycle_regularity: String,
    /// Cycle length days.
    pub cycle_length_days: Option<i32>,
    /// Period duration days.
    pub period_duration_days: Option<i32>,
    /// Flow heaviness.
    pub flow_heaviness: String,
    /// Intermenstrual bleeding.
    pub intermenstrual_bleeding: YesNo,
    /// Postcoital bleeding.
    pub postcoital_bleeding: YesNo,
    /// Dysmenorrhoea.
    pub dysmenorrhoea: String,
    /// Last menstrual period.
    pub last_menstrual_period: String,
    /// Amenorrhoea.
    pub amenorrhoea: YesNo,
    /// Amenorrhoea duration months.
    pub amenorrhoea_duration_months: Option<i32>,
}

/// Step 3 — Contraceptive history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContraceptiveHistory {
    /// Previous contraception.
    pub previous_contraception: YesNo,
    /// Previous coc.
    #[serde(rename = "previousCOC")]
    pub previous_coc: YesNo,
    /// Coc details.
    pub coc_details: String,
    /// Previous pop.
    #[serde(rename = "previousPOP")]
    pub previous_pop: YesNo,
    /// Pop details.
    pub pop_details: String,
    /// Previous implant.
    pub previous_implant: YesNo,
    /// Implant details.
    pub implant_details: String,
    /// Previous injection.
    pub previous_injection: YesNo,
    /// Injection details.
    pub injection_details: String,
    /// Previous iud.
    #[serde(rename = "previousIUD")]
    pub previous_iud: YesNo,
    /// Iud details.
    pub iud_details: String,
    /// Previous ius.
    #[serde(rename = "previousIUS")]
    pub previous_ius: YesNo,
    /// Ius details.
    pub ius_details: String,
    /// Previous patch ring.
    pub previous_patch_ring: YesNo,
    /// Patch ring details.
    pub patch_ring_details: String,
    /// Previous barrier.
    pub previous_barrier: YesNo,
    /// Reason for change.
    pub reason_for_change: String,
    /// Adverse effects.
    pub adverse_effects: String,
}

/// Step 4 — Medical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Migraine.
    pub migraine: YesNo,
    /// Migraine with aura.
    pub migraine_with_aura: YesNo,
    /// Migraine frequency.
    pub migraine_frequency: String,
    /// Breast cancer.
    pub breast_cancer: String,
    /// Cervical cancer.
    pub cervical_cancer: YesNo,
    /// Liver disease.
    pub liver_disease: String,
    /// Gallbladder disease.
    pub gallbladder_disease: YesNo,
    /// Inflammatory bowel disease.
    pub inflammatory_bowel_disease: YesNo,
    /// Sle.
    pub sle: YesNo,
    /// Sle antiphospholipid.
    pub sle_antiphospholipid: YesNo,
    /// Epilepsy.
    pub epilepsy: YesNo,
    /// Diabetes.
    pub diabetes: String,
    /// Diabetes complications.
    pub diabetes_complications: YesNo,
    /// Sti.
    pub sti: YesNo,
    /// Sti details.
    pub sti_details: String,
    /// Pid.
    pub pid: YesNo,
}

/// Step 5 — Cardiovascular risk.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CardiovascularRisk {
    /// Hypertension.
    pub hypertension: YesNo,
    /// Systolic BP.
    #[serde(rename = "systolicBP")]
    pub systolic_bp: Option<i32>,
    /// Diastolic BP.
    #[serde(rename = "diastolicBP")]
    pub diastolic_bp: Option<i32>,
    /// BP controlled.
    pub bp_controlled: YesNo,
    /// Ischaemic heart disease.
    pub ischaemic_heart_disease: YesNo,
    /// Stroke history.
    pub stroke_history: YesNo,
    /// Valvular heart disease.
    pub valvular_heart_disease: YesNo,
    /// Valvular complications.
    pub valvular_complications: YesNo,
    /// Hyperlipidaemia.
    pub hyperlipidaemia: YesNo,
    /// Family history vte.
    #[serde(rename = "familyHistoryVTE")]
    pub family_history_vte: YesNo,
    /// Family history cvd.
    #[serde(rename = "familyHistoryCVD")]
    pub family_history_cvd: YesNo,
    /// Family cvd details.
    #[serde(rename = "familyCVDDetails")]
    pub family_cvd_details: String,
}

/// Step 6 — Thromboembolism risk.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThromboembolismRisk {
    /// Previous DVT.
    #[serde(rename = "previousDVT")]
    pub previous_dvt: YesNo,
    /// DVT details.
    pub dvt_details: String,
    /// Previous pe.
    #[serde(rename = "previousPE")]
    pub previous_pe: YesNo,
    /// Pe details.
    pub pe_details: String,
    /// Known thrombophilia.
    pub known_thrombophilia: YesNo,
    /// Thrombophilia type.
    pub thrombophilia_type: String,
    /// Immobility risk.
    pub immobility_risk: YesNo,
    /// Immobility details.
    pub immobility_details: String,
    /// Recent major surgery.
    pub recent_major_surgery: YesNo,
    /// Surgery details.
    pub surgery_details: String,
    /// Long haul travel.
    pub long_haul_travel: YesNo,
}

/// Step 7 — Current medications.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// Enzyme inducing drugs.
    pub enzyme_inducing_drugs: YesNo,
    /// Enzyme inducing details.
    pub enzyme_inducing_details: String,
    /// Anticoagulants.
    pub anticoagulants: YesNo,
    /// Anticoagulant details.
    pub anticoagulant_details: String,
    /// Antiepileptics.
    pub antiepileptics: YesNo,
    /// Antiepileptic details.
    pub antiepileptic_details: String,
    /// Antiretrovirals.
    pub antiretrovirals: YesNo,
    /// Antiretroviral details.
    pub antiretroviral_details: String,
    /// Antibiotics.
    pub antibiotics: YesNo,
    /// Antibiotic details.
    pub antibiotic_details: String,
    /// Ssri snri.
    pub ssri_snri: YesNo,
    /// Ssri snri details.
    pub ssri_snri_details: String,
    /// Herbal remedies.
    pub herbal_remedies: YesNo,
    /// Herbal details.
    pub herbal_details: String,
    /// Other medications.
    pub other_medications: String,
    /// Drug allergies.
    pub drug_allergies: YesNo,
    /// Drug allergy details.
    pub drug_allergy_details: String,
}

/// Step 8 — Lifestyle assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleAssessment {
    /// Smoking.
    pub smoking: String,
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<i32>,
    /// Age over 35 smoker.
    pub age_over_35_smoker: YesNo,
    /// Alcohol.
    pub alcohol: String,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<i32>,
    /// Recreational drug use.
    pub recreational_drug_use: YesNo,
    /// Recreational drug details.
    pub recreational_drug_details: String,
    /// Exercise frequency.
    pub exercise_frequency: String,
    /// Sexual activity.
    pub sexual_activity: YesNo,
    /// Number of partners.
    pub number_of_partners: String,
}

/// Step 9 — Contraceptive preferences.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContraceptivePreferences {
    /// Preferred method.
    pub preferred_method: String,
    /// Hormonal acceptable.
    pub hormonal_acceptable: YesNo,
    /// Long acting acceptable.
    pub long_acting_acceptable: YesNo,
    /// Daily pill acceptable.
    pub daily_pill_acceptable: YesNo,
    /// Intrauterine acceptable.
    pub intrauterine_acceptable: YesNo,
    /// Fertility plans.
    pub fertility_plans: String,
    /// Breastfeeding.
    pub breastfeeding: YesNo,
    /// Postpartum weeks.
    pub postpartum_weeks: Option<i32>,
    /// Concerns.
    pub concerns: String,
}

/// Step 10 — Clinical recommendation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalRecommendation {
    /// Clinical notes.
    pub clinical_notes: String,
}

/// Full birth-control-assessment data model.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Menstrual history.
    pub menstrual_history: MenstrualHistory,
    /// Contraceptive history.
    pub contraceptive_history: ContraceptiveHistory,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Cardiovascular risk.
    pub cardiovascular_risk: CardiovascularRisk,
    /// Thromboembolism risk.
    pub thromboembolism_risk: ThromboembolismRisk,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Lifestyle assessment.
    pub lifestyle_assessment: LifestyleAssessment,
    /// Contraceptive preferences.
    pub contraceptive_preferences: ContraceptivePreferences,
    /// Clinical recommendation.
    pub clinical_recommendation: ClinicalRecommendation,
}

/// Per-method UK MEC categories for the six contraceptive methods.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MethodMEC {
    /// Coc.
    pub coc: MECCategory,
    /// Pop.
    pub pop: MECCategory,
    /// Implant.
    pub implant: MECCategory,
    /// Injection.
    pub injection: MECCategory,
    /// Iud.
    pub iud: MECCategory,
    /// Ius.
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
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Mec category.
    pub mec_category: u8,
    /// Affected methods.
    pub affected_methods: Vec<String>,
}

/// A safety flag computed independently of grading.
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

/// Grading output for a birth-control assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Method mec.
    pub method_mec: MethodMEC,
    /// Overall risk.
    pub overall_risk: String,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
