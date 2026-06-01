use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type ConcernLevel = String;

/// Step 1 — Demographics for both partners.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub patient_first_name: String,
    pub patient_last_name: String,
    pub patient_date_of_birth: String,
    pub patient_sex: String,
    pub partner_first_name: String,
    pub partner_last_name: String,
    pub partner_date_of_birth: String,
    pub partner_sex: String,
    pub relationship_duration: Option<i32>,
    pub ethnicity: String,
}

/// Step 2 — Reproductive history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReproductiveHistory {
    pub duration_trying_months: Option<i32>,
    pub prior_pregnancies: Option<i32>,
    pub prior_live_births: Option<i32>,
    pub prior_miscarriages: Option<i32>,
    pub prior_ectopic: Option<i32>,
    pub prior_terminations: Option<i32>,
    pub prior_fertility_treatment: YesNo,
    pub prior_treatment_details: String,
    pub contraception_stopped: YesNo,
    pub contraception_stopped_date: String,
}

/// Step 3 — Menstrual cycle history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualCycle {
    pub menarche_age: Option<i32>,
    pub cycle_length_days: Option<i32>,
    pub cycle_regularity: String,
    pub period_duration_days: Option<i32>,
    pub heavy_bleeding: YesNo,
    pub dysmenorrhoea: YesNo,
    pub intermenstrual_bleeding: YesNo,
    pub last_menstrual_period: String,
    pub cycle_notes: String,
}

/// Step 4 — Medical & surgical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalSurgicalHistory {
    pub pelvic_inflammatory_disease: YesNo,
    pub endometriosis: YesNo,
    pub polycystic_ovary_syndrome: YesNo,
    pub fibroids: YesNo,
    pub thyroid_disorder: YesNo,
    pub diabetes: YesNo,
    pub cancer_history: YesNo,
    pub cancer_treatment_details: String,
    pub pelvic_surgery: YesNo,
    pub pelvic_surgery_details: String,
    pub sexually_transmitted_infections: YesNo,
    pub sti_details: String,
    pub other_conditions: String,
}

/// Step 5 — Lifestyle factors.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleFactors {
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub tobacco_status: String,
    pub cigarettes_per_day: Option<i32>,
    pub alcohol_level: String,
    pub alcohol_units_per_week: Option<i32>,
    pub caffeine_level: String,
    pub recreational_drugs: YesNo,
    pub recreational_drug_details: String,
    pub exercise_frequency: String,
    pub occupational_hazards: YesNo,
    pub occupational_hazard_details: String,
}

/// A single current medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub dose: String,
    pub frequency: String,
    pub indication: String,
}

/// Step 6 — Current medications and supplements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsSupplements {
    pub current_medications: Vec<Medication>,
    pub folic_acid: YesNo,
    pub folic_acid_dose_mcg: Option<i32>,
    pub vitamin_d: YesNo,
    pub other_supplements: String,
}

/// Step 7 — Partner factors and semen analysis (WHO 2021).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PartnerSemen {
    pub partner_age_years: Option<i32>,
    pub partner_smoking: String,
    pub partner_alcohol: String,
    pub partner_occupational_hazards: YesNo,
    pub partner_medical_history: String,
    pub semen_analysis_done: YesNo,
    pub semen_analysis_date: String,
    pub semen_volume_ml: Option<f64>,
    pub semen_concentration_million_per_ml: Option<f64>,
    pub semen_total_motility_percent: Option<f64>,
    pub semen_progressive_motility_percent: Option<f64>,
    pub semen_normal_morphology_percent: Option<f64>,
    pub semen_notes: String,
}

/// Step 8 — Hormone profile.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HormoneProfile {
    pub fsh: Option<f64>,
    pub lh: Option<f64>,
    pub amh: Option<f64>,
    pub oestradiol: Option<f64>,
    pub tsh: Option<f64>,
    pub prolactin: Option<f64>,
    pub testosterone: Option<f64>,
    pub progesterone_day21: Option<f64>,
    pub hormone_test_date: String,
    pub hormone_notes: String,
}

/// Step 9 — Investigations (ultrasound, HSG, hysteroscopy, laparoscopy).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    pub transvaginal_ultrasound: YesNo,
    pub antral_follicle_count: Option<i32>,
    pub hysterosalpingogram_done: YesNo,
    pub hysterosalpingogram_result: String,
    pub hysteroscopy_done: YesNo,
    pub hysteroscopy_result: String,
    pub laparoscopy_done: YesNo,
    pub laparoscopy_result: String,
    pub other_investigations: String,
}

/// Step 10 — Clinical recommendation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalRecommendation {
    pub clinician_name: String,
    pub assessment_date: String,
    pub recommendation: String,
    pub referral_urgency: String,
    pub additional_notes: String,
}

/// Full NICE CG156 fertility assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub reproductive_history: ReproductiveHistory,
    pub menstrual_cycle: MenstrualCycle,
    pub medical_surgical_history: MedicalSurgicalHistory,
    pub lifestyle_factors: LifestyleFactors,
    pub medications_supplements: MedicationsSupplements,
    pub partner_semen: PartnerSemen,
    pub hormone_profile: HormoneProfile,
    pub investigations: Investigations,
    pub clinical_recommendation: ClinicalRecommendation,
}

/// A rule that fired during grading; contributes its weight to the concern score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
}

/// A clinician-facing flag computed independently of the concern score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a fertility assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub concern_score: i32,
    pub concern_level: ConcernLevel,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
