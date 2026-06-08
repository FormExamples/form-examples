//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Type aliases matching the frontend union types.
/// Empty string `''` indicates an unanswered enum / text field.
/// `Option<i32>`/`Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
/// Risk level.
pub type RiskLevel = String;

/// Maternal demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MaternalDemographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Age at booking.
    pub age_at_booking: Option<i32>,
    /// Ethnicity.
    pub ethnicity: String,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Occupation.
    pub occupation: String,
    /// Partner status.
    pub partner_status: String,
}

/// Obstetric history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObstetricHistory {
    /// Gravidity.
    pub gravidity: Option<i32>,
    /// Parity.
    pub parity: Option<i32>,
    /// Previous miscarriages.
    pub previous_miscarriages: Option<i32>,
    /// Previous terminations.
    pub previous_terminations: Option<i32>,
    /// Previous stillbirths.
    pub previous_stillbirths: Option<i32>,
    /// Previous neonatal deaths.
    pub previous_neonatal_deaths: Option<i32>,
    /// Previous preterm birth.
    pub previous_preterm_birth: YesNo,
    /// Previous pre eclampsia.
    pub previous_pre_eclampsia: YesNo,
    /// Previous gestational diabetes.
    pub previous_gestational_diabetes: YesNo,
    /// Previous caesarean.
    pub previous_caesarean: YesNo,
    /// Previous caesarean count.
    pub previous_caesarean_count: Option<i32>,
    /// Previous shoulder dystocia.
    pub previous_shoulder_dystocia: YesNo,
    /// Previous postpartum haemorrhage.
    pub previous_postpartum_haemorrhage: YesNo,
    /// Previous large baby.
    pub previous_large_baby: YesNo,
    /// Previous small baby.
    pub previous_small_baby: YesNo,
    /// Previous congenital anomaly.
    pub previous_congenital_anomaly: YesNo,
    /// Obstetric notes.
    pub obstetric_notes: String,
}

/// Medical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Chronic hypertension.
    pub chronic_hypertension: YesNo,
    /// Cardiac disease.
    pub cardiac_disease: YesNo,
    /// Pre existing diabetes.
    pub pre_existing_diabetes: YesNo,
    /// Thyroid disease.
    pub thyroid_disease: YesNo,
    /// Renal disease.
    pub renal_disease: YesNo,
    /// Epilepsy.
    pub epilepsy: YesNo,
    /// Asthma.
    pub asthma: YesNo,
    /// Autoimmune disease.
    pub autoimmune_disease: YesNo,
    /// Hiv positive.
    pub hiv_positive: YesNo,
    /// Hepatitis.
    pub hepatitis: YesNo,
    /// Previous vte.
    pub previous_vte: YesNo,
    /// Thrombophilia.
    pub thrombophilia: YesNo,
    /// Mental health history.
    pub mental_health_history: YesNo,
    /// Bariatric surgery.
    pub bariatric_surgery: YesNo,
    /// Other medical conditions.
    pub other_medical_conditions: String,
    /// Current medications.
    pub current_medications: String,
}

/// Current pregnancy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentPregnancy {
    /// Last menstrual period.
    pub last_menstrual_period: String,
    /// Estimated due date.
    pub estimated_due_date: String,
    /// Dating scan date.
    pub dating_scan_date: String,
    /// Gestation weeks.
    pub gestation_weeks: Option<i32>,
    /// Gestation days.
    pub gestation_days: Option<i32>,
    /// Multiple pregnancy.
    pub multiple_pregnancy: YesNo,
    /// Chorionicity.
    pub chorionicity: String,
    /// Ivf conception.
    pub ivf_conception: YesNo,
    /// Folic acid preconception.
    pub folic_acid_preconception: YesNo,
    /// First antenatal contact.
    pub first_antenatal_contact: YesNo,
    /// Booking date.
    pub booking_date: String,
}

/// Lifestyle social factors.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleSocialFactors {
    /// Smoking status.
    pub smoking_status: String,
    /// Cigarettes per day.
    pub cigarettes_per_day: Option<i32>,
    /// Alcohol use.
    pub alcohol_use: String,
    /// Substance use.
    pub substance_use: String,
    /// Domestic abuse.
    pub domestic_abuse: YesNo,
    /// Safeguarding concerns.
    pub safeguarding_concerns: YesNo,
    /// Housing insecurity.
    pub housing_insecurity: YesNo,
    /// Financial difficulty.
    pub financial_difficulty: YesNo,
    /// Requires interpreter.
    pub requires_interpreter: YesNo,
    /// Interpreter language.
    pub interpreter_language: String,
    /// Asylum or refugee.
    pub asylum_or_refugee: YesNo,
    /// Female genital mutilation.
    pub female_genital_mutilation: YesNo,
    /// Social notes.
    pub social_notes: String,
}

/// Screening results.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreeningResults {
    /// Combined test result.
    pub combined_test_result: String,
    /// Combined test risk.
    pub combined_test_risk: String,
    /// Anomaly scan completed.
    pub anomaly_scan_completed: YesNo,
    /// Anomaly scan findings.
    pub anomaly_scan_findings: String,
    /// Gtt result.
    pub gtt_result: String,
    /// Gtt fasting.
    pub gtt_fasting: Option<f64>,
    /// Gtt two hour.
    pub gtt_two_hour: Option<f64>,
    /// Blood group.
    pub blood_group: String,
    /// Rhesus status.
    pub rhesus_status: String,
    /// Antibody screen positive.
    pub antibody_screen_positive: YesNo,
    /// Infection screen abnormal.
    pub infection_screen_abnormal: YesNo,
    /// Infection screen details.
    pub infection_screen_details: String,
    /// Haemoglobin.
    pub haemoglobin: String,
    /// Screening notes.
    pub screening_notes: String,
}

/// Mental health assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthAssessment {
    /// Whooley1.
    pub whooley1: YesNo,
    /// Whooley2.
    pub whooley2: YesNo,
    /// Gad2 q1.
    pub gad2_q1: String,
    /// Gad2 q2.
    pub gad2_q2: String,
    /// Previous postnatal depression.
    pub previous_postnatal_depression: YesNo,
    /// Previous severe mental illness.
    pub previous_severe_mental_illness: YesNo,
    /// Currently on psychotropic meds.
    pub currently_on_psychotropic_meds: YesNo,
    /// Self harm ideation.
    pub self_harm_ideation: YesNo,
    /// Mental health notes.
    pub mental_health_notes: String,
}

/// Fetal assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FetalAssessment {
    /// Fundal height.
    pub fundal_height: Option<f64>,
    /// Fetal lie.
    pub fetal_lie: String,
    /// Fetal presentation.
    pub fetal_presentation: String,
    /// Engaged.
    pub engaged: YesNo,
    /// Fetal movements reported.
    pub fetal_movements_reported: String,
    /// Fetal heart rate.
    pub fetal_heart_rate: Option<i32>,
    /// Reduced fetal movements.
    pub reduced_fetal_movements: YesNo,
    /// Growth concern.
    pub growth_concern: YesNo,
    /// Growth concern details.
    pub growth_concern_details: String,
    /// Fetal notes.
    pub fetal_notes: String,
}

/// Birth preferences.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BirthPreferences {
    /// Preferred birth setting.
    pub preferred_birth_setting: String,
    /// Preferred analgesia.
    pub preferred_analgesia: String,
    /// Birth partner planned.
    pub birth_partner_planned: YesNo,
    /// Birth plan completed.
    pub birth_plan_completed: YesNo,
    /// Feeding choice breast.
    pub feeding_choice_breast: YesNo,
    /// Feeding choice formula.
    pub feeding_choice_formula: YesNo,
    /// Vbac requested.
    pub vbac_requested: YesNo,
    /// Birth preference notes.
    pub birth_preference_notes: String,
}

/// Care plan followup.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarePlanFollowup {
    /// Recommended care pathway.
    pub recommended_care_pathway: String,
    /// Consultant referral required.
    pub consultant_referral_required: YesNo,
    /// Mental health referral required.
    pub mental_health_referral_required: YesNo,
    /// Safeguarding referral required.
    pub safeguarding_referral_required: YesNo,
    /// Aspirin prophylaxis indicated.
    pub aspirin_prophylaxis_indicated: YesNo,
    /// Vte prophylaxis indicated.
    pub vte_prophylaxis_indicated: YesNo,
    /// Next appointment date.
    pub next_appointment_date: String,
    /// Care plan notes.
    pub care_plan_notes: String,
}

/// Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Maternal demographics.
    pub maternal_demographics: MaternalDemographics,
    /// Obstetric history.
    pub obstetric_history: ObstetricHistory,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Current pregnancy.
    pub current_pregnancy: CurrentPregnancy,
    /// Lifestyle social factors.
    pub lifestyle_social_factors: LifestyleSocialFactors,
    /// Screening results.
    pub screening_results: ScreeningResults,
    /// Mental health assessment.
    pub mental_health_assessment: MentalHealthAssessment,
    /// Fetal assessment.
    pub fetal_assessment: FetalAssessment,
    /// Birth preferences.
    pub birth_preferences: BirthPreferences,
    /// Care plan followup.
    pub care_plan_followup: CarePlanFollowup,
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
    /// Risk.
    pub risk: RiskLevel,
}

/// A flagged issue raised independently of NG201 risk stratification.
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

/// Grading output for an obstetrics assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Answered count.
    pub answered_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
