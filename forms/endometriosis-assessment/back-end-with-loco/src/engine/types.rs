//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Empty string `''` indicates an unanswered enum / text field.
/// `Option<...>` with None indicates an unanswered numeric / date field.
pub type YesNo = String;

/// Demographics — patient identity and anthropometrics.
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

/// Menstrual history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MenstrualHistory {
    /// Age at menarche.
    pub age_at_menarche: Option<i32>,
    /// Cycle regularity.
    pub cycle_regularity: String,
    /// Cycle length days.
    pub cycle_length_days: Option<i32>,
    /// Period duration days.
    pub period_duration_days: Option<i32>,
    /// Flow heaviness.
    pub flow_heaviness: String,
    /// Clots present.
    pub clots_present: String,
    /// Intermenstrual bleeding.
    pub intermenstrual_bleeding: String,
    /// Postcoital bleeding.
    pub postcoital_bleeding: String,
    /// Dysmenorrhoea severity.
    pub dysmenorrhoea_severity: String,
    /// Days off work per cycle.
    pub days_off_work_per_cycle: Option<i32>,
    /// Current contraception.
    pub current_contraception: String,
    /// Menstrual notes.
    pub menstrual_notes: String,
}

/// Pain assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PainAssessment {
    /// Has pelvic pain.
    pub has_pelvic_pain: YesNo,
    /// Pelvic pain severity.
    pub pelvic_pain_severity: Option<i32>,
    /// Pelvic pain character.
    pub pelvic_pain_character: String,
    /// Pelvic pain location.
    pub pelvic_pain_location: String,
    /// Pelvic pain timing.
    pub pelvic_pain_timing: String,
    /// Dyspareunia.
    pub dyspareunia: String,
    /// Dyspareunia severity.
    pub dyspareunia_severity: Option<i32>,
    /// Dyschezia.
    pub dyschezia: YesNo,
    /// Dyschezia cyclical.
    pub dyschezia_cyclical: YesNo,
    /// Back pain.
    pub back_pain: YesNo,
    /// Leg pain.
    pub leg_pain: YesNo,
    /// Pain worse with activity.
    pub pain_worse_with_activity: YesNo,
    /// Pain notes.
    pub pain_notes: String,
}

/// Gastrointestinal symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GastrointestinalSymptoms {
    /// Has gi symptoms.
    pub has_gi_symptoms: YesNo,
    /// Bloating.
    pub bloating: YesNo,
    /// Bloating cyclical.
    pub bloating_cyclical: YesNo,
    /// Nausea.
    pub nausea: YesNo,
    /// Constipation.
    pub constipation: YesNo,
    /// Diarrhoea.
    pub diarrhoea: YesNo,
    /// Alternating bowel habit.
    pub alternating_bowel_habit: YesNo,
    /// Rectal bleeding.
    pub rectal_bleeding: YesNo,
    /// Rectal bleeding cyclical.
    pub rectal_bleeding_cyclical: YesNo,
    /// Bowel obstruction symptoms.
    pub bowel_obstruction_symptoms: YesNo,
    /// Gi notes.
    pub gi_notes: String,
}

/// Urinary symptoms.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrinarySymptoms {
    /// Has urinary symptoms.
    pub has_urinary_symptoms: YesNo,
    /// Frequency.
    pub frequency: YesNo,
    /// Urgency.
    pub urgency: YesNo,
    /// Dysuria.
    pub dysuria: YesNo,
    /// Haematuria.
    pub haematuria: YesNo,
    /// Haematuria cyclical.
    pub haematuria_cyclical: YesNo,
    /// Flank pain.
    pub flank_pain: YesNo,
    /// Urinary obstruction symptoms.
    pub urinary_obstruction_symptoms: YesNo,
    /// Recurrent utis.
    pub recurrent_utis: YesNo,
    /// Urinary notes.
    pub urinary_notes: String,
}

/// Fertility assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FertilityAssessment {
    /// Trying to conceive.
    pub trying_to_conceive: YesNo,
    /// Duration trying months.
    pub duration_trying_months: Option<i32>,
    /// Previous pregnancies.
    pub previous_pregnancies: Option<i32>,
    /// Live births.
    pub live_births: Option<i32>,
    /// Miscarriages.
    pub miscarriages: Option<i32>,
    /// Ectopic pregnancies.
    pub ectopic_pregnancies: Option<i32>,
    /// Previous fertility treatment.
    pub previous_fertility_treatment: YesNo,
    /// Fertility treatment details.
    pub fertility_treatment_details: String,
    /// Amh level.
    pub amh_level: Option<f64>,
    /// Partner semen analysis.
    pub partner_semen_analysis: String,
    /// Future fertility concerns.
    pub future_fertility_concerns: YesNo,
    /// Fertility notes.
    pub fertility_notes: String,
}

/// Previous treatments.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousTreatments {
    /// Nsaids tried.
    pub nsaids_tried: YesNo,
    /// Nsaids effective.
    pub nsaids_effective: String,
    /// Paracetamol tried.
    pub paracetamol_tried: YesNo,
    /// Opioids tried.
    pub opioids_tried: YesNo,
    /// Opioids current.
    pub opioids_current: YesNo,
    /// Combined pill tried.
    pub combined_pill_tried: YesNo,
    /// Combined pill effective.
    pub combined_pill_effective: String,
    /// Progesterone tried.
    pub progesterone_tried: YesNo,
    /// Progesterone type.
    pub progesterone_type: String,
    /// Gnrh agonist tried.
    pub gnrh_agonist_tried: YesNo,
    /// Gnrh agonist duration months.
    pub gnrh_agonist_duration_months: Option<i32>,
    /// Mirena ius tried.
    pub mirena_ius_tried: YesNo,
    /// Other treatments.
    pub other_treatments: String,
    /// Treatment notes.
    pub treatment_notes: String,
}

/// Surgical history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SurgicalHistory {
    /// Previous laparoscopy.
    pub previous_laparoscopy: YesNo,
    /// Number of laparoscopies.
    pub number_of_laparoscopies: Option<i32>,
    /// Most recent laparoscopy date.
    pub most_recent_laparoscopy_date: String,
    /// Endometriosis confirmed surgically.
    pub endometriosis_confirmed_surgically: YesNo,
    /// Histological confirmation.
    pub histological_confirmation: YesNo,
    /// Asrm stage at surgery.
    pub asrm_stage_at_surgery: String,
    /// Sites found.
    pub sites_found: String,
    /// Excision performed.
    pub excision_performed: YesNo,
    /// Ablation performed.
    pub ablation_performed: YesNo,
    /// Adhesiolysis performed.
    pub adhesiolysis_performed: YesNo,
    /// Endometrioma drained.
    pub endometrioma_drained: YesNo,
    /// Bowel surgery.
    pub bowel_surgery: YesNo,
    /// Bladder surgery.
    pub bladder_surgery: YesNo,
    /// Other pelvic surgery.
    pub other_pelvic_surgery: String,
    /// Surgical complications.
    pub surgical_complications: String,
    /// Surgical notes.
    pub surgical_notes: String,
}

/// Quality of life (EHP-30 domain scores plus impact).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QualityOfLife {
    /// Pain domain score.
    pub pain_domain_score: Option<i32>,
    /// Control powerlessness score.
    pub control_powerlessness_score: Option<i32>,
    /// Emotional wellbeing score.
    pub emotional_wellbeing_score: Option<i32>,
    /// Social support score.
    pub social_support_score: Option<i32>,
    /// Self image score.
    pub self_image_score: Option<i32>,
    /// Work impact.
    pub work_impact: String,
    /// Relationship impact.
    pub relationship_impact: String,
    /// Sleep impact.
    pub sleep_impact: String,
    /// Mental health impact.
    pub mental_health_impact: String,
    /// Exercise impact.
    pub exercise_impact: String,
    /// Qol notes.
    pub qol_notes: String,
}

/// Treatment planning.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TreatmentPlanning {
    /// Treatment goals.
    pub treatment_goals: String,
    /// Preferred approach.
    pub preferred_approach: String,
    /// Surgery considered.
    pub surgery_considered: YesNo,
    /// Surgery type considered.
    pub surgery_type_considered: String,
    /// Fertility preservation needed.
    pub fertility_preservation_needed: YesNo,
    /// Mdt referral needed.
    pub mdt_referral_needed: YesNo,
    /// Pain management referral.
    pub pain_management_referral: YesNo,
    /// Psychology referral.
    pub psychology_referral: YesNo,
    /// Physiotherapy referral.
    pub physiotherapy_referral: YesNo,
    /// Fertility clinic referral.
    pub fertility_clinic_referral: YesNo,
    /// Imaging requested.
    pub imaging_requested: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Planning notes.
    pub planning_notes: String,
}

/// Full endometriosis assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Menstrual history.
    pub menstrual_history: MenstrualHistory,
    /// Pain assessment.
    pub pain_assessment: PainAssessment,
    /// Gastrointestinal symptoms.
    pub gastrointestinal_symptoms: GastrointestinalSymptoms,
    /// Urinary symptoms.
    pub urinary_symptoms: UrinarySymptoms,
    /// Fertility assessment.
    pub fertility_assessment: FertilityAssessment,
    /// Previous treatments.
    pub previous_treatments: PreviousTreatments,
    /// Surgical history.
    pub surgical_history: SurgicalHistory,
    /// Quality of life.
    pub quality_of_life: QualityOfLife,
    /// Treatment planning.
    pub treatment_planning: TreatmentPlanning,
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
    /// Grade.
    pub grade: i32,
}

/// A safety flag computed independently of staging (priority-sorted alert).
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

/// Grading output for an endometriosis assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Asrm stage.
    pub asrm_stage: Option<i32>,
    /// Asrm points.
    pub asrm_points: i32,
    /// Ehp30 score.
    pub ehp30_score: Option<i32>,
    /// Overall severity.
    pub overall_severity: String,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
