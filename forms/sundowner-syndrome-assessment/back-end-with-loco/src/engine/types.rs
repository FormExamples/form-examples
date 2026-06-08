//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

// Type aliases mirroring the frontend union types.
// Empty string `''` indicates an unanswered text/enum field.
// `Option<T>` with None indicates an unanswered numeric / date field.
/// Yes no.
pub type YesNo = String;
/// Severity.
pub type Severity = String;

/// Demographics — step 1.
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
    /// Age years.
    pub age_years: Option<i32>,
    /// Primary diagnosis.
    pub primary_diagnosis: String,
    /// Care setting.
    pub care_setting: String,
}

/// Cognitive status — step 2.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CognitiveStatus {
    /// Dementia stage.
    pub dementia_stage: String,
    /// Cognitive impairment.
    pub cognitive_impairment: String,
    /// Mmse score.
    pub mmse_score: Option<i32>,
    /// Mmse date.
    pub mmse_date: String,
    /// Prior delirium history.
    pub prior_delirium_history: YesNo,
    /// Cognitive notes.
    pub cognitive_notes: String,
}

/// Single NPI domain score (frequency 1..4, severity 1..3; 0 = unanswered).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NpiDomainScore {
    /// Frequency.
    pub frequency: i32,
    /// Severity.
    pub severity: i32,
}

/// Behavioural symptoms — step 3.
///
/// `cmai` is a map of `cmai01..cmai29` -> 1..7 (0 unanswered).
/// `npi`  is a map of NPI domain key -> NpiDomainScore.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BehaviouralSymptoms {
    /// Cmai.
    #[serde(default)]
    pub cmai: BTreeMap<String, i32>,
    /// Npi.
    #[serde(default)]
    pub npi: BTreeMap<String, NpiDomainScore>,
    /// Behavioural notes.
    pub behavioural_notes: String,
}

/// Temporal pattern — step 4.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TemporalPattern {
    /// Typical onset time.
    pub typical_onset_time: String,
    /// Typical offset time.
    pub typical_offset_time: String,
    /// Peak time.
    pub peak_time: String,
    /// Episode frequency.
    pub episode_frequency: String,
    /// Average duration minutes.
    pub average_duration_minutes: Option<i32>,
    /// Worse at dusk.
    pub worse_at_dusk: YesNo,
    /// Worse seasonally.
    pub worse_seasonally: YesNo,
    /// Temporal notes.
    pub temporal_notes: String,
}

/// Trigger identification — step 5.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TriggerIdentification {
    /// Fatigue.
    pub fatigue: YesNo,
    /// Hunger.
    pub hunger: YesNo,
    /// Pain.
    pub pain: YesNo,
    /// Infection.
    pub infection: YesNo,
    /// Dehydration.
    pub dehydration: YesNo,
    /// Sensory overload.
    pub sensory_overload: YesNo,
    /// Unfamiliar surroundings.
    pub unfamiliar_surroundings: YesNo,
    /// Carer change.
    pub carer_change: YesNo,
    /// Low light.
    pub low_light: YesNo,
    /// Medication timing.
    pub medication_timing: YesNo,
    /// Other triggers.
    pub other_triggers: String,
}

/// Sleep / wake cycle — step 6.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SleepWakeCycle {
    /// Bedtime hour clock.
    pub bedtime_hour_clock: Option<i32>,
    /// Average hours of sleep.
    pub average_hours_of_sleep: Option<f64>,
    /// Difficulty falling asleep.
    pub difficulty_falling_asleep: YesNo,
    /// Nighttime wandering.
    pub nighttime_wandering: YesNo,
    /// Early morning waking.
    pub early_morning_waking: YesNo,
    /// Daytime napping.
    pub daytime_napping: YesNo,
    /// Night awakening count.
    pub night_awakening_count: Option<i32>,
    /// Reversed sleep cycle.
    pub reversed_sleep_cycle: YesNo,
    /// Sleep notes.
    pub sleep_notes: String,
}

/// One medication line item in the medication-review repeat list.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationItem {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
    /// Indication.
    pub indication: String,
}

/// Medication review — step 7.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationReview {
    /// Current medications.
    #[serde(default)]
    pub current_medications: Vec<MedicationItem>,
    /// Anticholinergic burden.
    pub anticholinergic_burden: YesNo,
    /// Sedative use.
    pub sedative_use: YesNo,
    /// Antipsychotic use.
    pub antipsychotic_use: YesNo,
    /// Recent medication change.
    pub recent_medication_change: YesNo,
    /// Recent medication change details.
    pub recent_medication_change_details: String,
    /// Medication adherence.
    pub medication_adherence: String,
    /// Medication notes.
    pub medication_notes: String,
}

/// Environmental assessment — step 8.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentalAssessment {
    /// Adequate daylight.
    pub adequate_daylight: YesNo,
    /// Excessive noise.
    pub excessive_noise: YesNo,
    /// Unfamiliar environment.
    pub unfamiliar_environment: YesNo,
    /// Cluttered.
    pub cluttered: YesNo,
    /// Mirrors or shadows.
    pub mirrors_or_shadows: YesNo,
    /// Consistent routine.
    pub consistent_routine: YesNo,
    /// Adequate social contact.
    pub adequate_social_contact: YesNo,
    /// Environmental notes.
    pub environmental_notes: String,
}

/// Carer impact — step 9.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarerImpact {
    /// Primary carer.
    pub primary_carer: String,
    /// Carer relationship.
    pub carer_relationship: String,
    /// Carer strain level.
    pub carer_strain_level: String,
    /// Carer sleep disturbed.
    pub carer_sleep_disturbed: YesNo,
    /// Carer burnout signs.
    pub carer_burnout_signs: YesNo,
    /// Respite care in place.
    pub respite_care_in_place: YesNo,
    /// Formal support engaged.
    pub formal_support_engaged: YesNo,
    /// Carer notes.
    pub carer_notes: String,
}

/// Management plan — step 10.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManagementPlan {
    /// Non pharmacological plan.
    pub non_pharmacological_plan: YesNo,
    /// Non pharmacological details.
    pub non_pharmacological_details: String,
    /// Environmental modifications.
    pub environmental_modifications: YesNo,
    /// Environmental modification details.
    pub environmental_modification_details: String,
    /// Medication review required.
    pub medication_review_required: YesNo,
    /// Referral required.
    pub referral_required: YesNo,
    /// Referral details.
    pub referral_details: String,
    /// Review date.
    pub review_date: String,
    /// Plan summary.
    pub plan_summary: String,
}

/// Full Sundowner Syndrome Assessment record (all 10 steps).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Cognitive status.
    pub cognitive_status: CognitiveStatus,
    /// Behavioural symptoms.
    pub behavioural_symptoms: BehaviouralSymptoms,
    /// Temporal pattern.
    pub temporal_pattern: TemporalPattern,
    /// Trigger identification.
    pub trigger_identification: TriggerIdentification,
    /// Sleep wake cycle.
    pub sleep_wake_cycle: SleepWakeCycle,
    /// Medication review.
    pub medication_review: MedicationReview,
    /// Environmental assessment.
    pub environmental_assessment: EnvironmentalAssessment,
    /// Carer impact.
    pub carer_impact: CarerImpact,
    /// Management plan.
    pub management_plan: ManagementPlan,
}

/// A rule that fired during grading (e.g. CMAI-BAND, NPI-TOTAL).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Detail.
    pub detail: String,
}

/// A clinician-facing flag raised by the flagged-issue engine.
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

/// Grading output for a sundowner assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Cmai score.
    pub cmai_score: i32,
    /// Npi score.
    pub npi_score: i32,
    /// Severity.
    pub severity: Severity,
    /// Cmai answered count.
    pub cmai_answered_count: u32,
    /// Npi answered count.
    pub npi_answered_count: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
