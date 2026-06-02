use serde::{Deserialize, Serialize};

/// Empty string `''` indicates an unanswered enum / text field.
/// `Option<...>` with None indicates an unanswered numeric / date field.
pub type YesNo = String;

/// Demographics — patient identity and anthropometrics.
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

/// Menstrual history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistory {
    pub age_at_menarche: Option<i32>,
    pub cycle_regularity: String,
    pub cycle_length_days: Option<i32>,
    pub period_duration_days: Option<i32>,
    pub flow_heaviness: String,
    pub clots_present: String,
    pub intermenstrual_bleeding: String,
    pub postcoital_bleeding: String,
    pub dysmenorrhoea_severity: String,
    pub days_off_work_per_cycle: Option<i32>,
    pub current_contraception: String,
    pub menstrual_notes: String,
}

/// Pain assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PainAssessment {
    pub has_pelvic_pain: YesNo,
    pub pelvic_pain_severity: Option<i32>,
    pub pelvic_pain_character: String,
    pub pelvic_pain_location: String,
    pub pelvic_pain_timing: String,
    pub dyspareunia: String,
    pub dyspareunia_severity: Option<i32>,
    pub dyschezia: YesNo,
    pub dyschezia_cyclical: YesNo,
    pub back_pain: YesNo,
    pub leg_pain: YesNo,
    pub pain_worse_with_activity: YesNo,
    pub pain_notes: String,
}

/// Gastrointestinal symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GastrointestinalSymptoms {
    pub has_gi_symptoms: YesNo,
    pub bloating: YesNo,
    pub bloating_cyclical: YesNo,
    pub nausea: YesNo,
    pub constipation: YesNo,
    pub diarrhoea: YesNo,
    pub alternating_bowel_habit: YesNo,
    pub rectal_bleeding: YesNo,
    pub rectal_bleeding_cyclical: YesNo,
    pub bowel_obstruction_symptoms: YesNo,
    pub gi_notes: String,
}

/// Urinary symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrinarySymptoms {
    pub has_urinary_symptoms: YesNo,
    pub frequency: YesNo,
    pub urgency: YesNo,
    pub dysuria: YesNo,
    pub haematuria: YesNo,
    pub haematuria_cyclical: YesNo,
    pub flank_pain: YesNo,
    pub urinary_obstruction_symptoms: YesNo,
    pub recurrent_utis: YesNo,
    pub urinary_notes: String,
}

/// Fertility assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FertilityAssessment {
    pub trying_to_conceive: YesNo,
    pub duration_trying_months: Option<i32>,
    pub previous_pregnancies: Option<i32>,
    pub live_births: Option<i32>,
    pub miscarriages: Option<i32>,
    pub ectopic_pregnancies: Option<i32>,
    pub previous_fertility_treatment: YesNo,
    pub fertility_treatment_details: String,
    pub amh_level: Option<f64>,
    pub partner_semen_analysis: String,
    pub future_fertility_concerns: YesNo,
    pub fertility_notes: String,
}

/// Previous treatments.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousTreatments {
    pub nsaids_tried: YesNo,
    pub nsaids_effective: String,
    pub paracetamol_tried: YesNo,
    pub opioids_tried: YesNo,
    pub opioids_current: YesNo,
    pub combined_pill_tried: YesNo,
    pub combined_pill_effective: String,
    pub progesterone_tried: YesNo,
    pub progesterone_type: String,
    pub gnrh_agonist_tried: YesNo,
    pub gnrh_agonist_duration_months: Option<i32>,
    pub mirena_ius_tried: YesNo,
    pub other_treatments: String,
    pub treatment_notes: String,
}

/// Surgical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SurgicalHistory {
    pub previous_laparoscopy: YesNo,
    pub number_of_laparoscopies: Option<i32>,
    pub most_recent_laparoscopy_date: String,
    pub endometriosis_confirmed_surgically: YesNo,
    pub histological_confirmation: YesNo,
    pub asrm_stage_at_surgery: String,
    pub sites_found: String,
    pub excision_performed: YesNo,
    pub ablation_performed: YesNo,
    pub adhesiolysis_performed: YesNo,
    pub endometrioma_drained: YesNo,
    pub bowel_surgery: YesNo,
    pub bladder_surgery: YesNo,
    pub other_pelvic_surgery: String,
    pub surgical_complications: String,
    pub surgical_notes: String,
}

/// Quality of life (EHP-30 domain scores plus impact).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QualityOfLife {
    pub pain_domain_score: Option<i32>,
    pub control_powerlessness_score: Option<i32>,
    pub emotional_wellbeing_score: Option<i32>,
    pub social_support_score: Option<i32>,
    pub self_image_score: Option<i32>,
    pub work_impact: String,
    pub relationship_impact: String,
    pub sleep_impact: String,
    pub mental_health_impact: String,
    pub exercise_impact: String,
    pub qol_notes: String,
}

/// Treatment planning.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentPlanning {
    pub treatment_goals: String,
    pub preferred_approach: String,
    pub surgery_considered: YesNo,
    pub surgery_type_considered: String,
    pub fertility_preservation_needed: YesNo,
    pub mdt_referral_needed: YesNo,
    pub pain_management_referral: YesNo,
    pub psychology_referral: YesNo,
    pub physiotherapy_referral: YesNo,
    pub fertility_clinic_referral: YesNo,
    pub imaging_requested: String,
    pub follow_up_interval: String,
    pub planning_notes: String,
}

/// Full endometriosis assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub menstrual_history: MenstrualHistory,
    pub pain_assessment: PainAssessment,
    pub gastrointestinal_symptoms: GastrointestinalSymptoms,
    pub urinary_symptoms: UrinarySymptoms,
    pub fertility_assessment: FertilityAssessment,
    pub previous_treatments: PreviousTreatments,
    pub surgical_history: SurgicalHistory,
    pub quality_of_life: QualityOfLife,
    pub treatment_planning: TreatmentPlanning,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: i32,
}

/// A safety flag computed independently of staging (priority-sorted alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an endometriosis assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub asrm_stage: Option<i32>,
    pub asrm_points: i32,
    pub ehp30_score: Option<i32>,
    pub overall_severity: String,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
