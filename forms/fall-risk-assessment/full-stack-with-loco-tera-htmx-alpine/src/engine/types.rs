use serde::{Deserialize, Serialize};

/// Yes/No enum modelled as a String. Empty string `''` indicates an
/// unanswered field; "yes" / "no" are the valid values.
pub type YesNo = String;

/// Severity label for an assessment outcome.
pub type Severity = String;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub age: Option<i32>,
    pub care_setting: String,
    pub primary_diagnosis: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FallHistory {
    pub has_fallen_in_past_year: YesNo,
    pub number_of_falls_past_year: Option<i32>,
    pub last_fall_date: String,
    pub most_recent_fall_injurious: YesNo,
    pub most_recent_fall_injury_details: String,
    pub recurrent_falls_with_injury: YesNo,
    pub fear_of_falling: YesNo,
    pub fall_circumstances: String,
}

/// Morse Fall Scale (MFS) six-item responses. Each value is the integer
/// score the patient selected; `None` indicates unanswered.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MorseFallScale {
    pub history_of_falling: Option<i32>,
    pub secondary_diagnosis: Option<i32>,
    pub ambulatory_aid: Option<i32>,
    pub iv_or_heparin_lock: Option<i32>,
    pub gait_transferring: Option<i32>,
    pub mental_status: Option<i32>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MobilityGait {
    pub mobility_level: String,
    pub assistive_device_used: String,
    pub unsteady_gait: YesNo,
    pub difficulty_rising_from_chair: YesNo,
    pub balance_impairment: YesNo,
    pub weakness_lower_extremity: YesNo,
    pub orthostatic_hypotension: YesNo,
    pub orthostatic_hypotension_severe: YesNo,
    pub timed_up_and_go_seconds: String,
    pub mobility_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub dose: String,
    pub frequency: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationReview {
    pub medications: Vec<Medication>,
    pub polypharmacy: YesNo,
    pub sedatives_or_hypnotics: YesNo,
    pub antihypertensives: YesNo,
    pub diuretics: YesNo,
    pub anticoagulants: YesNo,
    pub opioids: YesNo,
    pub antidepressants: YesNo,
    pub antipsychotics: YesNo,
    pub recent_medication_change: YesNo,
    pub medication_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisionSensory {
    pub vision_impairment: YesNo,
    pub vision_corrected: YesNo,
    pub hearing_impairment: YesNo,
    pub peripheral_neuropathy: YesNo,
    pub cataracts: YesNo,
    pub glaucoma: YesNo,
    pub macular_degeneration: YesNo,
    pub vision_last_checked: String,
    pub sensory_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentalAssessment {
    pub loos_throw_rugs: YesNo,
    pub cluttered_walkways: YesNo,
    pub poor_lighting: YesNo,
    pub stairs_without_handrails: YesNo,
    pub bathroom_grab_bars_absent: YesNo,
    pub unsuitable_footwear: YesNo,
    pub bed_height_problem: YesNo,
    pub hip_protectors_used: YesNo,
    pub environmental_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CognitiveAssessment {
    pub dementia_diagnosis: YesNo,
    pub confusion_or_disorientation: YesNo,
    pub impulsivity: YesNo,
    pub overestimates_ability: YesNo,
    pub delirium: YesNo,
    pub cognitive_screen_tool: String,
    pub cognitive_screen_score: String,
    pub cognitive_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousInterventions {
    pub falls_clinic_referral: YesNo,
    pub physiotherapy_provided: YesNo,
    pub occupational_therapy_provided: YesNo,
    pub medication_review_completed: YesNo,
    pub home_safety_assessment: YesNo,
    pub intervention_declined: YesNo,
    pub missed_referral: YesNo,
    pub intervention_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FallPreventionPlan {
    pub bed_alarm: YesNo,
    pub chair_alarm: YesNo,
    pub non_slip_footwear: YesNo,
    pub hip_protectors_recommended: YesNo,
    pub exercise_programme: YesNo,
    pub vitamin_d_supplement: YesNo,
    pub environmental_modifications: YesNo,
    pub medication_deprescribing: YesNo,
    pub carer_education_provided: YesNo,
    pub plan_notes: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub fall_history: FallHistory,
    pub mfs: MorseFallScale,
    pub mobility_gait: MobilityGait,
    pub medication_review: MedicationReview,
    pub vision_sensory: VisionSensory,
    pub environmental: EnvironmentalAssessment,
    pub cognitive: CognitiveAssessment,
    pub previous_interventions: PreviousInterventions,
    pub prevention_plan: FallPreventionPlan,
}

/// An MFS item rule that fired (item answered) during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
}

/// A clinical safety flag detected independently of the raw MFS score.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a fall-risk assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub mfs_score: i32,
    pub severity: Severity,
    pub critical_override: bool,
    pub critical_reasons: Vec<String>,
    pub answered_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
