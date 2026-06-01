use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

// Type aliases mirroring the frontend union types.
// Empty string `''` indicates an unanswered text/enum field.
// `Option<T>` with None indicates an unanswered numeric / date field.
pub type YesNo = String;
pub type Severity = String;

/// Demographics — step 1.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub age_years: Option<i32>,
    pub primary_diagnosis: String,
    pub care_setting: String,
}

/// Cognitive status — step 2.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CognitiveStatus {
    pub dementia_stage: String,
    pub cognitive_impairment: String,
    pub mmse_score: Option<i32>,
    pub mmse_date: String,
    pub prior_delirium_history: YesNo,
    pub cognitive_notes: String,
}

/// Single NPI domain score (frequency 1..4, severity 1..3; 0 = unanswered).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NpiDomainScore {
    pub frequency: i32,
    pub severity: i32,
}

/// Behavioural symptoms — step 3.
///
/// `cmai` is a map of `cmai01..cmai29` -> 1..7 (0 unanswered).
/// `npi`  is a map of NPI domain key -> NpiDomainScore.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BehaviouralSymptoms {
    #[serde(default)]
    pub cmai: BTreeMap<String, i32>,
    #[serde(default)]
    pub npi: BTreeMap<String, NpiDomainScore>,
    pub behavioural_notes: String,
}

/// Temporal pattern — step 4.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TemporalPattern {
    pub typical_onset_time: String,
    pub typical_offset_time: String,
    pub peak_time: String,
    pub episode_frequency: String,
    pub average_duration_minutes: Option<i32>,
    pub worse_at_dusk: YesNo,
    pub worse_seasonally: YesNo,
    pub temporal_notes: String,
}

/// Trigger identification — step 5.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TriggerIdentification {
    pub fatigue: YesNo,
    pub hunger: YesNo,
    pub pain: YesNo,
    pub infection: YesNo,
    pub dehydration: YesNo,
    pub sensory_overload: YesNo,
    pub unfamiliar_surroundings: YesNo,
    pub carer_change: YesNo,
    pub low_light: YesNo,
    pub medication_timing: YesNo,
    pub other_triggers: String,
}

/// Sleep / wake cycle — step 6.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SleepWakeCycle {
    pub bedtime_hour_clock: Option<i32>,
    pub average_hours_of_sleep: Option<f64>,
    pub difficulty_falling_asleep: YesNo,
    pub nighttime_wandering: YesNo,
    pub early_morning_waking: YesNo,
    pub daytime_napping: YesNo,
    pub night_awakening_count: Option<i32>,
    pub reversed_sleep_cycle: YesNo,
    pub sleep_notes: String,
}

/// One medication line item in the medication-review repeat list.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationItem {
    pub name: String,
    pub dose: String,
    pub frequency: String,
    pub indication: String,
}

/// Medication review — step 7.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationReview {
    #[serde(default)]
    pub current_medications: Vec<MedicationItem>,
    pub anticholinergic_burden: YesNo,
    pub sedative_use: YesNo,
    pub antipsychotic_use: YesNo,
    pub recent_medication_change: YesNo,
    pub recent_medication_change_details: String,
    pub medication_adherence: String,
    pub medication_notes: String,
}

/// Environmental assessment — step 8.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentalAssessment {
    pub adequate_daylight: YesNo,
    pub excessive_noise: YesNo,
    pub unfamiliar_environment: YesNo,
    pub cluttered: YesNo,
    pub mirrors_or_shadows: YesNo,
    pub consistent_routine: YesNo,
    pub adequate_social_contact: YesNo,
    pub environmental_notes: String,
}

/// Carer impact — step 9.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CarerImpact {
    pub primary_carer: String,
    pub carer_relationship: String,
    pub carer_strain_level: String,
    pub carer_sleep_disturbed: YesNo,
    pub carer_burnout_signs: YesNo,
    pub respite_care_in_place: YesNo,
    pub formal_support_engaged: YesNo,
    pub carer_notes: String,
}

/// Management plan — step 10.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManagementPlan {
    pub non_pharmacological_plan: YesNo,
    pub non_pharmacological_details: String,
    pub environmental_modifications: YesNo,
    pub environmental_modification_details: String,
    pub medication_review_required: YesNo,
    pub referral_required: YesNo,
    pub referral_details: String,
    pub review_date: String,
    pub plan_summary: String,
}

/// Full Sundowner Syndrome Assessment record (all 10 steps).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub cognitive_status: CognitiveStatus,
    pub behavioural_symptoms: BehaviouralSymptoms,
    pub temporal_pattern: TemporalPattern,
    pub trigger_identification: TriggerIdentification,
    pub sleep_wake_cycle: SleepWakeCycle,
    pub medication_review: MedicationReview,
    pub environmental_assessment: EnvironmentalAssessment,
    pub carer_impact: CarerImpact,
    pub management_plan: ManagementPlan,
}

/// A rule that fired during grading (e.g. CMAI-BAND, NPI-TOTAL).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub detail: String,
}

/// A clinician-facing flag raised by the flagged-issue engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a sundowner assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub cmai_score: i32,
    pub npi_score: i32,
    pub severity: Severity,
    pub cmai_answered_count: u32,
    pub npi_answered_count: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
