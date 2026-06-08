//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Risk level.
pub type RiskLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// Gestational age weeks.
    pub gestational_age_weeks: Option<u8>,
    /// Estimated due date.
    pub estimated_due_date: String,
    /// Referring provider.
    pub referring_provider: String,
    /// Booking date.
    pub booking_date: String,
    /// Contact phone.
    pub contact_phone: String,
}

// ─── Obstetric History (Step 2) ─────────────────────────────

/// Obstetric history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ObstetricHistory {
    /// Gravida.
    pub gravida: Option<u8>,
    /// Para.
    pub para: Option<u8>,
    /// Previous caesarean.
    pub previous_caesarean: String,
    /// Previous preterm birth.
    pub previous_preterm_birth: String,
    /// Previous stillbirth.
    pub previous_stillbirth: String,
    /// Previous preeclampsia.
    pub previous_preeclampsia: String,
    /// Recurrent miscarriage.
    pub recurrent_miscarriage: String,
    /// Inter pregnancy interval.
    pub inter_pregnancy_interval: String,
}

// ─── Current Pregnancy (Step 3) ─────────────────────────────

/// Current pregnancy.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentPregnancy {
    /// Pregnancy type.
    pub pregnancy_type: String,
    /// Conception method.
    pub conception_method: String,
    /// Vaginal bleeding.
    pub vaginal_bleeding: String,
    /// Severe nausea.
    pub severe_nausea: String,
    /// Fetal movements.
    pub fetal_movements: String,
    /// Gestational diabetes screening.
    pub gestational_diabetes_screening: String,
    /// Rhesus status.
    pub rhesus_status: String,
    /// Cervical length.
    pub cervical_length: String,
}

// ─── Antenatal Screening (Step 4) ───────────────────────────

/// Antenatal screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AntenatalScreening {
    /// Combined screening result.
    pub combined_screening_result: String,
    /// Quadruple test result.
    pub quadruple_test_result: String,
    /// Nipt result.
    pub nipt_result: String,
    /// Anomaly scan result.
    pub anomaly_scan_result: String,
    /// Infectious disease screening.
    pub infectious_disease_screening: String,
    /// Group b strep.
    pub group_b_strep: String,
    /// Sickle cell thalassaemia.
    pub sickle_cell_thalassaemia: String,
    /// Screening declined.
    pub screening_declined: String,
}

// ─── Physical Examination (Step 5) ──────────────────────────

/// Physical examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExamination {
    /// Blood pressure systolic.
    pub blood_pressure_systolic: Option<u16>,
    /// Blood pressure diastolic.
    pub blood_pressure_diastolic: Option<u16>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Fundal height.
    pub fundal_height: Option<u16>,
    /// Fetal heart rate.
    pub fetal_heart_rate: Option<u16>,
    /// Fetal presentation.
    pub fetal_presentation: String,
    /// Oedema.
    pub oedema: String,
    /// Proteinuria.
    pub proteinuria: String,
}

// ─── Blood Tests (Step 6) ───────────────────────────────────

/// Blood tests.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BloodTests {
    /// Haemoglobin.
    pub haemoglobin: Option<f64>,
    /// Platelet count.
    pub platelet_count: Option<u16>,
    /// Blood group.
    pub blood_group: String,
    /// Antibody screen.
    pub antibody_screen: String,
    /// Hba1c.
    pub hba1c: Option<f64>,
    /// Thyroid function.
    pub thyroid_function: String,
    /// Liver function.
    pub liver_function: String,
    /// Renal function.
    pub renal_function: String,
}

// ─── Ultrasound Findings (Step 7) ───────────────────────────

/// Ultrasound findings.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UltrasoundFindings {
    /// Dating scan consistent.
    pub dating_scan_consistent: String,
    /// Nuchal translucency.
    pub nuchal_translucency: String,
    /// Amniotic fluid index.
    pub amniotic_fluid_index: String,
    /// Placental position.
    pub placental_position: String,
    /// Fetal growth centile.
    pub fetal_growth_centile: String,
    /// Structural abnormalities.
    pub structural_abnormalities: String,
    /// Doppler findings.
    pub doppler_findings: String,
    /// Cervical length scan.
    pub cervical_length_scan: String,
}

// ─── Mental Health & Wellbeing (Step 8) ─────────────────────

/// Mental health wellbeing.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthWellbeing {
    /// Phq2 score.
    pub phq2_score: Option<u8>,
    /// Gad2 score.
    pub gad2_score: Option<u8>,
    /// Previous mental health history.
    pub previous_mental_health_history: String,
    /// Current psychiatric medication.
    pub current_psychiatric_medication: String,
    /// Social support.
    pub social_support: String,
    /// Domestic abuse screening.
    pub domestic_abuse_screening: String,
    /// Substance use.
    pub substance_use: String,
    /// Smoking status.
    pub smoking_status: String,
}

// ─── Birth Planning (Step 9) ────────────────────────────────

/// Birth planning.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BirthPlanning {
    /// Preferred birth place.
    pub preferred_birth_place: String,
    /// Birth preferences discussed.
    pub birth_preferences_discussed: String,
    /// Pain relief preferences.
    pub pain_relief_preferences: String,
    /// Breastfeeding intention.
    pub breastfeeding_intention: String,
    /// Antenatal classes attended.
    pub antenatal_classes_attended: String,
    /// Birth partner identified.
    pub birth_partner_identified: String,
    /// Consent for interventions.
    pub consent_for_interventions: String,
    /// Vbac discussion.
    pub vbac_discussion: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall risk assessment.
    pub overall_risk_assessment: Option<u8>,
    /// Referral to consultant.
    pub referral_to_consultant: String,
    /// Safeguarding concerns.
    pub safeguarding_concerns: String,
    /// Additional investigations.
    pub additional_investigations: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Reviewed by.
    pub reviewed_by: String,
    /// Review date.
    pub review_date: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Obstetric history.
    pub obstetric_history: ObstetricHistory,
    /// Current pregnancy.
    pub current_pregnancy: CurrentPregnancy,
    /// Antenatal screening.
    pub antenatal_screening: AntenatalScreening,
    /// Physical examination.
    pub physical_examination: PhysicalExamination,
    /// Blood tests.
    pub blood_tests: BloodTests,
    /// Ultrasound findings.
    pub ultrasound_findings: UltrasoundFindings,
    /// Mental health wellbeing.
    pub mental_health_wellbeing: MentalHealthWellbeing,
    /// Birth planning.
    pub birth_planning: BirthPlanning,
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
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Risk score.
    pub risk_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
