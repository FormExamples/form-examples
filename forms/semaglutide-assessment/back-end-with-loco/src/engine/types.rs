//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Eligibility level.
pub type EligibilityLevel = String;

// ─── Patient Information (Step 1) ────────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// Contact phone.
    pub contact_phone: String,
    /// Contact email.
    pub contact_email: String,
    /// Referring clinician.
    pub referring_clinician: String,
    /// Assessment date.
    pub assessment_date: String,
    /// NHS number.
    pub nhs_number: String,
}

// ─── Weight & BMI History (Step 2) ───────────────────────────

/// Weight BMI history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct WeightBmiHistory {
    /// Current weight kg.
    pub current_weight_kg: Option<f64>,
    /// Height cm.
    pub height_cm: Option<f64>,
    /// Current BMI.
    pub current_bmi: Option<f64>,
    /// Highest BMI.
    pub highest_bmi: Option<f64>,
    /// Weight loss attempts.
    pub weight_loss_attempts: String,
    /// Previous weight loss medications.
    pub previous_weight_loss_medications: String,
    /// Bariatric surgery history.
    pub bariatric_surgery_history: String,
    /// Weight gain duration.
    pub weight_gain_duration: String,
}

// ─── Medical History (Step 3) ────────────────────────────────

/// Medical history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    /// Type2 diabetes.
    pub type2_diabetes: String,
    /// Hypertension.
    pub hypertension: String,
    /// Dyslipidaemia.
    pub dyslipidaemia: String,
    /// Obstructive sleep apnoea.
    pub obstructive_sleep_apnoea: String,
    /// Cardiovascular disease.
    pub cardiovascular_disease: String,
    /// Pcos.
    pub pcos: String,
    /// Nafld.
    pub nafld: String,
    /// Osteoarthritis.
    pub osteoarthritis: String,
    /// Depression anxiety.
    pub depression_anxiety: String,
    /// Other comorbidities.
    pub other_comorbidities: String,
}

// ─── Contraindications (Step 4) ──────────────────────────────

/// Contraindications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Contraindications {
    /// Personal medullary thyroid cancer.
    pub personal_medullary_thyroid_cancer: String,
    /// Family men2.
    pub family_men2: String,
    /// Pancreatitis history.
    pub pancreatitis_history: String,
    /// Severe gi disease.
    pub severe_gi_disease: String,
    /// Pregnancy or planning.
    pub pregnancy_or_planning: String,
    /// Breastfeeding.
    pub breastfeeding: String,
    /// Type1 diabetes.
    pub type1_diabetes: String,
    /// Severe renal impairment.
    pub severe_renal_impairment: String,
    /// Known hypersensitivity.
    pub known_hypersensitivity: String,
    /// Eating disorder.
    pub eating_disorder: String,
}

// ─── Current Medications (Step 5) ────────────────────────────

/// Current medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentMedications {
    /// Insulin therapy.
    pub insulin_therapy: String,
    /// Sulfonylureas.
    pub sulfonylureas: String,
    /// Other glp1 agonist.
    pub other_glp1_agonist: String,
    /// Oral contraceptives.
    pub oral_contraceptives: String,
    /// Warfarin.
    pub warfarin: String,
    /// Antihypertensives.
    pub antihypertensives: String,
    /// Statins.
    pub statins: String,
    /// Other medications.
    pub other_medications: String,
}

// ─── Lifestyle Assessment (Step 6) ───────────────────────────

/// Lifestyle assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LifestyleAssessment {
    /// Diet quality.
    pub diet_quality: Option<u8>,
    /// Physical activity level.
    pub physical_activity_level: Option<u8>,
    /// Alcohol consumption.
    pub alcohol_consumption: String,
    /// Smoking status.
    pub smoking_status: String,
    /// Sleep quality.
    pub sleep_quality: Option<u8>,
    /// Stress level.
    pub stress_level: Option<u8>,
    /// Motivation to change.
    pub motivation_to_change: Option<u8>,
    /// Social support.
    pub social_support: Option<u8>,
}

// ─── Treatment Goals (Step 7) ────────────────────────────────

/// Treatment goals.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentGoals {
    /// Target weight loss percent.
    pub target_weight_loss_percent: Option<f64>,
    /// Primary goal.
    pub primary_goal: String,
    /// Glycaemic control goal.
    pub glycaemic_control_goal: String,
    /// Cardiovascular risk reduction.
    pub cardiovascular_risk_reduction: String,
    /// Mobility improvement.
    pub mobility_improvement: String,
    /// Quality of life improvement.
    pub quality_of_life_improvement: String,
    /// Realistic expectations.
    pub realistic_expectations: Option<u8>,
    /// Commitment to lifestyle changes.
    pub commitment_to_lifestyle_changes: Option<u8>,
}

// ─── Informed Consent (Step 8) ───────────────────────────────

/// Informed consent.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct InformedConsent {
    /// Understands mechanism.
    pub understands_mechanism: String,
    /// Understands side effects.
    pub understands_side_effects: String,
    /// Understands injection technique.
    pub understands_injection_technique: String,
    /// Understands dose escalation.
    pub understands_dose_escalation: String,
    /// Understands monitoring requirements.
    pub understands_monitoring_requirements: String,
    /// Consent given.
    pub consent_given: String,
    /// Consent date.
    pub consent_date: String,
    /// Clinician name.
    pub clinician_name: String,
}

// ─── Monitoring Plan (Step 9) ────────────────────────────────

/// Monitoring plan.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MonitoringPlan {
    /// Baseline bloods completed.
    pub baseline_bloods_completed: String,
    /// Hba1c baseline.
    pub hba1c_baseline: String,
    /// Renal function checked.
    pub renal_function_checked: String,
    /// Thyroid function checked.
    pub thyroid_function_checked: String,
    /// Follow up interval weeks.
    pub follow_up_interval_weeks: Option<u8>,
    /// Weight monitoring frequency.
    pub weight_monitoring_frequency: String,
    /// Side effect monitoring plan.
    pub side_effect_monitoring_plan: String,
    /// Dose escalation schedule.
    pub dose_escalation_schedule: String,
}

// ─── Clinical Review (Step 10) ───────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Overall eligibility assessment.
    pub overall_eligibility_assessment: Option<u8>,
    /// Benefit risk ratio.
    pub benefit_risk_ratio: Option<u8>,
    /// Patient suitability.
    pub patient_suitability: Option<u8>,
    /// Clinical confidence.
    pub clinical_confidence: Option<u8>,
    /// Recommended starting dose.
    pub recommended_starting_dose: String,
    /// Additional investigations needed.
    pub additional_investigations_needed: String,
    /// Referrals needed.
    pub referrals_needed: String,
    /// Clinician notes.
    pub clinician_notes: String,
}

// ─── Assessment Data (all sections) ──────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Weight BMI history.
    pub weight_bmi_history: WeightBmiHistory,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Contraindications.
    pub contraindications: Contraindications,
    /// Current medications.
    pub current_medications: CurrentMedications,
    /// Lifestyle assessment.
    pub lifestyle_assessment: LifestyleAssessment,
    /// Treatment goals.
    pub treatment_goals: TreatmentGoals,
    /// Informed consent.
    pub informed_consent: InformedConsent,
    /// Monitoring plan.
    pub monitoring_plan: MonitoringPlan,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ───────────────────────────────────────────

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
    /// Eligibility score.
    pub eligibility_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
