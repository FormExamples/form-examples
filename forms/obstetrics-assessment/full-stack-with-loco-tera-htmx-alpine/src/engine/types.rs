use serde::{Deserialize, Serialize};

/// Type aliases matching the frontend union types.
/// Empty string `''` indicates an unanswered enum / text field.
/// `Option<i32>`/`Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type RiskLevel = String;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MaternalDemographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub age_at_booking: Option<i32>,
    pub ethnicity: String,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub occupation: String,
    pub partner_status: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObstetricHistory {
    pub gravidity: Option<i32>,
    pub parity: Option<i32>,
    pub previous_miscarriages: Option<i32>,
    pub previous_terminations: Option<i32>,
    pub previous_stillbirths: Option<i32>,
    pub previous_neonatal_deaths: Option<i32>,
    pub previous_preterm_birth: YesNo,
    pub previous_pre_eclampsia: YesNo,
    pub previous_gestational_diabetes: YesNo,
    pub previous_caesarean: YesNo,
    pub previous_caesarean_count: Option<i32>,
    pub previous_shoulder_dystocia: YesNo,
    pub previous_postpartum_haemorrhage: YesNo,
    pub previous_large_baby: YesNo,
    pub previous_small_baby: YesNo,
    pub previous_congenital_anomaly: YesNo,
    pub obstetric_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    pub chronic_hypertension: YesNo,
    pub cardiac_disease: YesNo,
    pub pre_existing_diabetes: YesNo,
    pub thyroid_disease: YesNo,
    pub renal_disease: YesNo,
    pub epilepsy: YesNo,
    pub asthma: YesNo,
    pub autoimmune_disease: YesNo,
    pub hiv_positive: YesNo,
    pub hepatitis: YesNo,
    pub previous_vte: YesNo,
    pub thrombophilia: YesNo,
    pub mental_health_history: YesNo,
    pub bariatric_surgery: YesNo,
    pub other_medical_conditions: String,
    pub current_medications: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurrentPregnancy {
    pub last_menstrual_period: String,
    pub estimated_due_date: String,
    pub dating_scan_date: String,
    pub gestation_weeks: Option<i32>,
    pub gestation_days: Option<i32>,
    pub multiple_pregnancy: YesNo,
    pub chorionicity: String,
    pub ivf_conception: YesNo,
    pub folic_acid_preconception: YesNo,
    pub first_antenatal_contact: YesNo,
    pub booking_date: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleSocialFactors {
    pub smoking_status: String,
    pub cigarettes_per_day: Option<i32>,
    pub alcohol_use: String,
    pub substance_use: String,
    pub domestic_abuse: YesNo,
    pub safeguarding_concerns: YesNo,
    pub housing_insecurity: YesNo,
    pub financial_difficulty: YesNo,
    pub requires_interpreter: YesNo,
    pub interpreter_language: String,
    pub asylum_or_refugee: YesNo,
    pub female_genital_mutilation: YesNo,
    pub social_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreeningResults {
    pub combined_test_result: String,
    pub combined_test_risk: String,
    pub anomaly_scan_completed: YesNo,
    pub anomaly_scan_findings: String,
    pub gtt_result: String,
    pub gtt_fasting: Option<f64>,
    pub gtt_two_hour: Option<f64>,
    pub blood_group: String,
    pub rhesus_status: String,
    pub antibody_screen_positive: YesNo,
    pub infection_screen_abnormal: YesNo,
    pub infection_screen_details: String,
    pub haemoglobin: String,
    pub screening_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthAssessment {
    pub whooley1: YesNo,
    pub whooley2: YesNo,
    pub gad2_q1: String,
    pub gad2_q2: String,
    pub previous_postnatal_depression: YesNo,
    pub previous_severe_mental_illness: YesNo,
    pub currently_on_psychotropic_meds: YesNo,
    pub self_harm_ideation: YesNo,
    pub mental_health_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FetalAssessment {
    pub fundal_height: Option<f64>,
    pub fetal_lie: String,
    pub fetal_presentation: String,
    pub engaged: YesNo,
    pub fetal_movements_reported: String,
    pub fetal_heart_rate: Option<i32>,
    pub reduced_fetal_movements: YesNo,
    pub growth_concern: YesNo,
    pub growth_concern_details: String,
    pub fetal_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BirthPreferences {
    pub preferred_birth_setting: String,
    pub preferred_analgesia: String,
    pub birth_partner_planned: YesNo,
    pub birth_plan_completed: YesNo,
    pub feeding_choice_breast: YesNo,
    pub feeding_choice_formula: YesNo,
    pub vbac_requested: YesNo,
    pub birth_preference_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarePlanFollowup {
    pub recommended_care_pathway: String,
    pub consultant_referral_required: YesNo,
    pub mental_health_referral_required: YesNo,
    pub safeguarding_referral_required: YesNo,
    pub aspirin_prophylaxis_indicated: YesNo,
    pub vte_prophylaxis_indicated: YesNo,
    pub next_appointment_date: String,
    pub care_plan_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub maternal_demographics: MaternalDemographics,
    pub obstetric_history: ObstetricHistory,
    pub medical_history: MedicalHistory,
    pub current_pregnancy: CurrentPregnancy,
    pub lifestyle_social_factors: LifestyleSocialFactors,
    pub screening_results: ScreeningResults,
    pub mental_health_assessment: MentalHealthAssessment,
    pub fetal_assessment: FetalAssessment,
    pub birth_preferences: BirthPreferences,
    pub care_plan_followup: CarePlanFollowup,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub risk: RiskLevel,
}

/// A flagged issue raised independently of NG201 risk stratification.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an obstetrics assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub risk_level: RiskLevel,
    pub answered_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
