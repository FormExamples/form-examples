//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Concern level.
pub type ConcernLevel = String;

/// Step 1 — Demographics for both partners.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// Patient first name.
    pub patient_first_name: String,
    /// Patient last name.
    pub patient_last_name: String,
    /// Patient date of birth.
    pub patient_date_of_birth: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Partner first name.
    pub partner_first_name: String,
    /// Partner last name.
    pub partner_last_name: String,
    /// Partner date of birth.
    pub partner_date_of_birth: String,
    /// Partner sex.
    pub partner_sex: String,
    /// Relationship duration.
    pub relationship_duration: Option<i32>,
    /// Ethnicity.
    pub ethnicity: String,
}

/// Step 2 — Reproductive history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReproductiveHistory {
    /// Duration trying months.
    pub duration_trying_months: Option<i32>,
    /// Prior pregnancies.
    pub prior_pregnancies: Option<i32>,
    /// Prior live births.
    pub prior_live_births: Option<i32>,
    /// Prior miscarriages.
    pub prior_miscarriages: Option<i32>,
    /// Prior ectopic.
    pub prior_ectopic: Option<i32>,
    /// Prior terminations.
    pub prior_terminations: Option<i32>,
    /// Prior fertility treatment.
    pub prior_fertility_treatment: YesNo,
    /// Prior treatment details.
    pub prior_treatment_details: String,
    /// Contraception stopped.
    pub contraception_stopped: YesNo,
    /// Contraception stopped date.
    pub contraception_stopped_date: String,
}

/// Step 3 — Menstrual cycle history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualCycle {
    /// Menarche age.
    pub menarche_age: Option<i32>,
    /// Cycle length days.
    pub cycle_length_days: Option<i32>,
    /// Cycle regularity.
    pub cycle_regularity: String,
    /// Period duration days.
    pub period_duration_days: Option<i32>,
    /// Heavy bleeding.
    pub heavy_bleeding: YesNo,
    /// Dysmenorrhoea.
    pub dysmenorrhoea: YesNo,
    /// Intermenstrual bleeding.
    pub intermenstrual_bleeding: YesNo,
    /// Last menstrual period.
    pub last_menstrual_period: String,
    /// Cycle notes.
    pub cycle_notes: String,
}

/// Step 4 — Medical & surgical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalSurgicalHistory {
    /// Pelvic inflammatory disease.
    pub pelvic_inflammatory_disease: YesNo,
    /// Endometriosis.
    pub endometriosis: YesNo,
    /// Polycystic ovary syndrome.
    pub polycystic_ovary_syndrome: YesNo,
    /// Fibroids.
    pub fibroids: YesNo,
    /// Thyroid disorder.
    pub thyroid_disorder: YesNo,
    /// Diabetes.
    pub diabetes: YesNo,
    /// Cancer history.
    pub cancer_history: YesNo,
    /// Cancer treatment details.
    pub cancer_treatment_details: String,
    /// Pelvic surgery.
    pub pelvic_surgery: YesNo,
    /// Pelvic surgery details.
    pub pelvic_surgery_details: String,
    /// Sexually transmitted infections.
    pub sexually_transmitted_infections: YesNo,
    /// Sti details.
    pub sti_details: String,
    /// Other conditions.
    pub other_conditions: String,
}

/// Step 5 — Lifestyle factors.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleFactors {
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Tobacco status.
    pub tobacco_status: String,
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<i32>,
    /// Alcohol level.
    pub alcohol_level: String,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<i32>,
    /// Caffeine level.
    pub caffeine_level: String,
    /// Recreational drugs.
    pub recreational_drugs: YesNo,
    /// Recreational drug details.
    pub recreational_drug_details: String,
    /// Exercise frequency.
    pub exercise_frequency: String,
    /// Occupational hazards.
    pub occupational_hazards: YesNo,
    /// Occupational hazard details.
    pub occupational_hazard_details: String,
}

/// A single current medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
    /// Indication.
    pub indication: String,
}

/// Step 6 — Current medications and supplements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsSupplements {
    /// Current medications.
    pub current_medications: Vec<Medication>,
    /// Folic acid.
    pub folic_acid: YesNo,
    /// Folic acid dose mcg.
    pub folic_acid_dose_mcg: Option<i32>,
    /// Vitamin d.
    pub vitamin_d: YesNo,
    /// Other supplements.
    pub other_supplements: String,
}

/// Step 7 — Partner factors and semen analysis (WHO 2021).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PartnerSemen {
    /// Partner age years.
    pub partner_age_years: Option<i32>,
    /// Partner smoking.
    pub partner_smoking: String,
    /// Partner alcohol.
    pub partner_alcohol: String,
    /// Partner occupational hazards.
    pub partner_occupational_hazards: YesNo,
    /// Partner medical history.
    pub partner_medical_history: String,
    /// Semen analysis done.
    pub semen_analysis_done: YesNo,
    /// Semen analysis date.
    pub semen_analysis_date: String,
    /// Semen volume ml.
    pub semen_volume_ml: Option<f64>,
    /// Semen concentration million per ml.
    pub semen_concentration_million_per_ml: Option<f64>,
    /// Semen total motility percent.
    pub semen_total_motility_percent: Option<f64>,
    /// Semen progressive motility percent.
    pub semen_progressive_motility_percent: Option<f64>,
    /// Semen normal morphology percent.
    pub semen_normal_morphology_percent: Option<f64>,
    /// Semen notes.
    pub semen_notes: String,
}

/// Step 8 — Hormone profile.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HormoneProfile {
    /// Fsh.
    pub fsh: Option<f64>,
    /// Lh.
    pub lh: Option<f64>,
    /// Amh.
    pub amh: Option<f64>,
    /// Oestradiol.
    pub oestradiol: Option<f64>,
    /// Tsh.
    pub tsh: Option<f64>,
    /// Prolactin.
    pub prolactin: Option<f64>,
    /// Testosterone.
    pub testosterone: Option<f64>,
    /// Progesterone day21.
    pub progesterone_day21: Option<f64>,
    /// Hormone test date.
    pub hormone_test_date: String,
    /// Hormone notes.
    pub hormone_notes: String,
}

/// Step 9 — Investigations (ultrasound, HSG, hysteroscopy, laparoscopy).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Investigations {
    /// Transvaginal ultrasound.
    pub transvaginal_ultrasound: YesNo,
    /// Antral follicle count.
    pub antral_follicle_count: Option<i32>,
    /// Hysterosalpingogram done.
    pub hysterosalpingogram_done: YesNo,
    /// Hysterosalpingogram result.
    pub hysterosalpingogram_result: String,
    /// Hysteroscopy done.
    pub hysteroscopy_done: YesNo,
    /// Hysteroscopy result.
    pub hysteroscopy_result: String,
    /// Laparoscopy done.
    pub laparoscopy_done: YesNo,
    /// Laparoscopy result.
    pub laparoscopy_result: String,
    /// Other investigations.
    pub other_investigations: String,
}

/// Step 10 — Clinical recommendation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalRecommendation {
    /// Clinician name.
    pub clinician_name: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Recommendation.
    pub recommendation: String,
    /// Referral urgency.
    pub referral_urgency: String,
    /// Additional notes.
    pub additional_notes: String,
}

/// Full NICE CG156 fertility assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Reproductive history.
    pub reproductive_history: ReproductiveHistory,
    /// Menstrual cycle.
    pub menstrual_cycle: MenstrualCycle,
    /// Medical surgical history.
    pub medical_surgical_history: MedicalSurgicalHistory,
    /// Lifestyle factors.
    pub lifestyle_factors: LifestyleFactors,
    /// Medications supplements.
    pub medications_supplements: MedicationsSupplements,
    /// Partner semen.
    pub partner_semen: PartnerSemen,
    /// Hormone profile.
    pub hormone_profile: HormoneProfile,
    /// Investigations.
    pub investigations: Investigations,
    /// Clinical recommendation.
    pub clinical_recommendation: ClinicalRecommendation,
}

/// A rule that fired during grading; contributes its weight to the concern score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: i32,
}

/// A clinician-facing flag computed independently of the concern score.
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

/// Grading output for a fertility assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Concern score.
    pub concern_score: i32,
    /// Concern level.
    pub concern_level: ConcernLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
