//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Sleep quality.
pub type SleepQuality = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Full name.
    pub full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
    /// Address.
    pub address: String,
    /// Telephone.
    pub telephone: String,
    /// Email.
    pub email: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
}

// ─── Sleep Habits (Step 2) ──────────────────────────────────

/// Sleep habits.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SleepHabits {
    /// Bedtime.
    pub bedtime: String,
    /// Wake time.
    pub wake_time: String,
    /// Sleep latency minutes.
    pub sleep_latency_minutes: Option<u8>,
    /// Total sleep hours.
    pub total_sleep_hours: Option<f64>,
    /// Sleep efficiency.
    pub sleep_efficiency: Option<u8>,
    /// Naps per day.
    pub naps_per_day: Option<u8>,
    /// Nap duration minutes.
    pub nap_duration_minutes: Option<u8>,
    /// Weekend sleep difference.
    pub weekend_sleep_difference: String,
}

// ─── Sleep Quality PSQI (Step 3) ────────────────────────────

/// Sleep quality psqi.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SleepQualityPsqi {
    /// Subjective quality.
    pub subjective_quality: Option<u8>,
    /// Sleep latency.
    pub sleep_latency: Option<u8>,
    /// Sleep duration.
    pub sleep_duration: Option<u8>,
    /// Sleep efficiency score.
    pub sleep_efficiency_score: Option<u8>,
    /// Sleep disturbances.
    pub sleep_disturbances: Option<u8>,
    /// Sleep medication.
    pub sleep_medication: Option<u8>,
    /// Daytime dysfunction.
    pub daytime_dysfunction: Option<u8>,
}

// ─── Daytime Sleepiness ESS (Step 4) ────────────────────────

/// Daytime sleepiness.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DaytimeSleepiness {
    /// Ess sitting.
    pub ess_sitting: Option<u8>,
    /// Ess watching.
    pub ess_watching: Option<u8>,
    /// Ess sitting inactive.
    pub ess_sitting_inactive: Option<u8>,
    /// Ess passenger.
    pub ess_passenger: Option<u8>,
    /// Ess lying down.
    pub ess_lying_down: Option<u8>,
    /// Ess talking.
    pub ess_talking: Option<u8>,
    /// Ess after lunch.
    pub ess_after_lunch: Option<u8>,
    /// Ess traffic.
    pub ess_traffic: Option<u8>,
}

// ─── Sleep Disturbances (Step 5) ────────────────────────────

/// Sleep disturbances.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SleepDisturbances {
    /// Difficulty falling asleep.
    pub difficulty_falling_asleep: Option<u8>,
    /// Night wakings.
    pub night_wakings: Option<u8>,
    /// Early morning waking.
    pub early_morning_waking: Option<u8>,
    /// Nightmares.
    pub nightmares: Option<u8>,
    /// Leg restlessness.
    pub leg_restlessness: Option<u8>,
    /// Snoring.
    pub snoring: Option<u8>,
    /// Breathing pauses.
    pub breathing_pauses: Option<u8>,
    /// Pain disturbance.
    pub pain_disturbance: Option<u8>,
}

// ─── Sleep Apnoea Screening (Step 6) ────────────────────────

/// Sleep apnoea screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SleepApnoeaScreening {
    /// Loud snoring.
    pub loud_snoring: String,
    /// Witnessed apnoeas.
    pub witnessed_apnoeas: String,
    /// Tiredness.
    pub tiredness: String,
    /// Treated hypertension.
    pub treated_hypertension: String,
    /// BMI over35.
    pub bmi_over35: String,
    /// Age over50.
    pub age_over50: String,
    /// Neck circumference over40.
    pub neck_circumference_over40: String,
    /// Male.
    pub male: String,
    /// Stop bang score.
    pub stop_bang_score: Option<u8>,
}

// ─── Sleep Hygiene (Step 7) ─────────────────────────────────

/// Sleep hygiene.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SleepHygiene {
    /// Regular schedule.
    pub regular_schedule: String,
    /// Screen time before bed.
    pub screen_time_before_bed: String,
    /// Caffeine late use.
    pub caffeine_late_use: String,
    /// Alcohol before bed.
    pub alcohol_before_bed: String,
    /// Exercise timing.
    pub exercise_timing: String,
    /// Bedroom environment.
    pub bedroom_environment: Option<u8>,
    /// Bed used for sleep only.
    pub bed_used_for_sleep_only: String,
    /// Relaxation technique.
    pub relaxation_technique: String,
}

// ─── Medical & Medications (Step 8) ─────────────────────────

/// Medical medications.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MedicalMedications {
    /// Sleep medications.
    pub sleep_medications: String,
    /// Medication duration.
    pub medication_duration: String,
    /// Mental health condition.
    pub mental_health_condition: String,
    /// Chronic pain condition.
    pub chronic_pain_condition: String,
    /// Respiratory condition.
    pub respiratory_condition: String,
    /// Neurological condition.
    pub neurological_condition: String,
    /// Menopausal.
    pub menopausal: String,
    /// Shift work.
    pub shift_work: String,
}

// ─── Impact Assessment (Step 9) ─────────────────────────────

/// Impact assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ImpactAssessment {
    /// Work performance.
    pub work_performance: Option<u8>,
    /// Driving safety.
    pub driving_safety: Option<u8>,
    /// Social functioning.
    pub social_functioning: Option<u8>,
    /// Mood impact.
    pub mood_impact: Option<u8>,
    /// Concentration impact.
    pub concentration_impact: Option<u8>,
    /// Accident risk.
    pub accident_risk: String,
    /// Quality of life.
    pub quality_of_life: Option<u8>,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinician name.
    pub clinician_name: String,
    /// Review date.
    pub review_date: String,
    /// Psqi total.
    pub psqi_total: Option<u8>,
    /// Ess total.
    pub ess_total: Option<u8>,
    /// Stop bang total.
    pub stop_bang_total: Option<u8>,
    /// Clinical notes.
    pub clinical_notes: String,
    /// Diagnosis.
    pub diagnosis: String,
    /// Treatment plan.
    pub treatment_plan: String,
    /// Referral needed.
    pub referral_needed: String,
    /// Referral destination.
    pub referral_destination: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Sleep habits.
    pub sleep_habits: SleepHabits,
    /// Sleep quality psqi.
    pub sleep_quality_psqi: SleepQualityPsqi,
    /// Daytime sleepiness.
    pub daytime_sleepiness: DaytimeSleepiness,
    /// Sleep disturbances.
    pub sleep_disturbances: SleepDisturbances,
    /// Sleep apnoea screening.
    pub sleep_apnoea_screening: SleepApnoeaScreening,
    /// Sleep hygiene.
    pub sleep_hygiene: SleepHygiene,
    /// Medical medications.
    pub medical_medications: MedicalMedications,
    /// Impact assessment.
    pub impact_assessment: ImpactAssessment,
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
    /// Sleep quality.
    pub sleep_quality: SleepQuality,
    /// Psqi score.
    pub psqi_score: u8,
    /// Ess score.
    pub ess_score: u8,
    /// Stop bang score.
    pub stop_bang_score: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
