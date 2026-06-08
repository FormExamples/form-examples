//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Yes/No enum modelled as a String. Empty string `''` indicates an
/// unanswered field; "yes" / "no" are the valid values.
pub type YesNo = String;

/// Severity label for an assessment outcome.
pub type Severity = String;

/// Demographics.
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
    /// Age.
    pub age: Option<i32>,
    /// Care setting.
    pub care_setting: String,
    /// Primary diagnosis.
    pub primary_diagnosis: String,
}

/// Fall history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FallHistory {
    /// Has fallen in past year.
    pub has_fallen_in_past_year: YesNo,
    /// Number of falls past year.
    pub number_of_falls_past_year: Option<i32>,
    /// Last fall date.
    pub last_fall_date: String,
    /// Most recent fall injurious.
    pub most_recent_fall_injurious: YesNo,
    /// Most recent fall injury details.
    pub most_recent_fall_injury_details: String,
    /// Recurrent falls with injury.
    pub recurrent_falls_with_injury: YesNo,
    /// Fear of falling.
    pub fear_of_falling: YesNo,
    /// Fall circumstances.
    pub fall_circumstances: String,
}

/// Morse Fall Scale (MFS) six-item responses. Each value is the integer
/// score the patient selected; `None` indicates unanswered.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MorseFallScale {
    /// History of falling.
    pub history_of_falling: Option<i32>,
    /// Secondary diagnosis.
    pub secondary_diagnosis: Option<i32>,
    /// Ambulatory aid.
    pub ambulatory_aid: Option<i32>,
    /// IV or heparin lock.
    pub iv_or_heparin_lock: Option<i32>,
    /// Gait transferring.
    pub gait_transferring: Option<i32>,
    /// Mental status.
    pub mental_status: Option<i32>,
}

/// Mobility gait.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MobilityGait {
    /// Mobility level.
    pub mobility_level: String,
    /// Assistive device used.
    pub assistive_device_used: String,
    /// Unsteady gait.
    pub unsteady_gait: YesNo,
    /// Difficulty rising from chair.
    pub difficulty_rising_from_chair: YesNo,
    /// Balance impairment.
    pub balance_impairment: YesNo,
    /// Weakness lower extremity.
    pub weakness_lower_extremity: YesNo,
    /// Orthostatic hypotension.
    pub orthostatic_hypotension: YesNo,
    /// Orthostatic hypotension severe.
    pub orthostatic_hypotension_severe: YesNo,
    /// Timed up and go seconds.
    pub timed_up_and_go_seconds: String,
    /// Mobility notes.
    pub mobility_notes: String,
}

/// Medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
}

/// Medication review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationReview {
    /// Medications.
    pub medications: Vec<Medication>,
    /// Polypharmacy.
    pub polypharmacy: YesNo,
    /// Sedatives or hypnotics.
    pub sedatives_or_hypnotics: YesNo,
    /// Antihypertensives.
    pub antihypertensives: YesNo,
    /// Diuretics.
    pub diuretics: YesNo,
    /// Anticoagulants.
    pub anticoagulants: YesNo,
    /// Opioids.
    pub opioids: YesNo,
    /// Antidepressants.
    pub antidepressants: YesNo,
    /// Antipsychotics.
    pub antipsychotics: YesNo,
    /// Recent medication change.
    pub recent_medication_change: YesNo,
    /// Medication notes.
    pub medication_notes: String,
}

/// Vision sensory.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VisionSensory {
    /// Vision impairment.
    pub vision_impairment: YesNo,
    /// Vision corrected.
    pub vision_corrected: YesNo,
    /// Hearing impairment.
    pub hearing_impairment: YesNo,
    /// Peripheral neuropathy.
    pub peripheral_neuropathy: YesNo,
    /// Cataracts.
    pub cataracts: YesNo,
    /// Glaucoma.
    pub glaucoma: YesNo,
    /// Macular degeneration.
    pub macular_degeneration: YesNo,
    /// Vision last checked.
    pub vision_last_checked: String,
    /// Sensory notes.
    pub sensory_notes: String,
}

/// Environmental assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentalAssessment {
    /// Loos throw rugs.
    pub loos_throw_rugs: YesNo,
    /// Cluttered walkways.
    pub cluttered_walkways: YesNo,
    /// Poor lighting.
    pub poor_lighting: YesNo,
    /// Stairs without handrails.
    pub stairs_without_handrails: YesNo,
    /// Bathroom grab bars absent.
    pub bathroom_grab_bars_absent: YesNo,
    /// Unsuitable footwear.
    pub unsuitable_footwear: YesNo,
    /// Bed height problem.
    pub bed_height_problem: YesNo,
    /// Hip protectors used.
    pub hip_protectors_used: YesNo,
    /// Environmental notes.
    pub environmental_notes: String,
}

/// Cognitive assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CognitiveAssessment {
    /// Dementia diagnosis.
    pub dementia_diagnosis: YesNo,
    /// Confusion or disorientation.
    pub confusion_or_disorientation: YesNo,
    /// Impulsivity.
    pub impulsivity: YesNo,
    /// Overestimates ability.
    pub overestimates_ability: YesNo,
    /// Delirium.
    pub delirium: YesNo,
    /// Cognitive screen tool.
    pub cognitive_screen_tool: String,
    /// Cognitive screen score.
    pub cognitive_screen_score: String,
    /// Cognitive notes.
    pub cognitive_notes: String,
}

/// Previous interventions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousInterventions {
    /// Falls clinic referral.
    pub falls_clinic_referral: YesNo,
    /// Physiotherapy provided.
    pub physiotherapy_provided: YesNo,
    /// Occupational therapy provided.
    pub occupational_therapy_provided: YesNo,
    /// Medication review completed.
    pub medication_review_completed: YesNo,
    /// Home safety assessment.
    pub home_safety_assessment: YesNo,
    /// Intervention declined.
    pub intervention_declined: YesNo,
    /// Missed referral.
    pub missed_referral: YesNo,
    /// Intervention notes.
    pub intervention_notes: String,
}

/// Fall prevention plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FallPreventionPlan {
    /// Bed alarm.
    pub bed_alarm: YesNo,
    /// Chair alarm.
    pub chair_alarm: YesNo,
    /// Non slip footwear.
    pub non_slip_footwear: YesNo,
    /// Hip protectors recommended.
    pub hip_protectors_recommended: YesNo,
    /// Exercise programme.
    pub exercise_programme: YesNo,
    /// Vitamin d supplement.
    pub vitamin_d_supplement: YesNo,
    /// Environmental modifications.
    pub environmental_modifications: YesNo,
    /// Medication deprescribing.
    pub medication_deprescribing: YesNo,
    /// Carer education provided.
    pub carer_education_provided: YesNo,
    /// Plan notes.
    pub plan_notes: String,
}

/// Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Fall history.
    pub fall_history: FallHistory,
    /// Mfs.
    pub mfs: MorseFallScale,
    /// Mobility gait.
    pub mobility_gait: MobilityGait,
    /// Medication review.
    pub medication_review: MedicationReview,
    /// Vision sensory.
    pub vision_sensory: VisionSensory,
    /// Environmental.
    pub environmental: EnvironmentalAssessment,
    /// Cognitive.
    pub cognitive: CognitiveAssessment,
    /// Previous interventions.
    pub previous_interventions: PreviousInterventions,
    /// Prevention plan.
    pub prevention_plan: FallPreventionPlan,
}

/// An MFS item rule that fired (item answered) during grading.
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

/// A clinical safety flag detected independently of the raw MFS score.
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

/// Grading output for a fall-risk assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Mfs score.
    pub mfs_score: i32,
    /// Severity.
    pub severity: Severity,
    /// Critical override.
    pub critical_override: bool,
    /// Critical reasons.
    pub critical_reasons: Vec<String>,
    /// Answered count.
    pub answered_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
