//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Likelihood level.
pub type LikelihoodLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referral source.
    pub referral_source: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Clinic location.
    pub clinic_location: String,
}

// ─── Developmental History (Step 2) ─────────────────────────

/// Developmental history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DevelopmentalHistory {
    /// Childhood symptoms present.
    pub childhood_symptoms_present: String,
    /// Age of onset.
    pub age_of_onset: String,
    /// Childhood hyperactivity.
    pub childhood_hyperactivity: Option<u8>,
    /// Childhood inattention.
    pub childhood_inattention: Option<u8>,
    /// Childhood impulsivity.
    pub childhood_impulsivity: Option<u8>,
    /// School performance issues.
    pub school_performance_issues: String,
    /// School behavior reports.
    pub school_behavior_reports: String,
    /// Learning difficulties.
    pub learning_difficulties: String,
    /// Childhood notes.
    pub childhood_notes: String,
}

// ─── Inattention Symptoms (Step 3) ──────────────────────────

/// Inattention symptoms.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct InattentionSymptoms {
    /// Difficulty sustaining attention.
    pub difficulty_sustaining_attention: Option<u8>,
    /// Fails to give close attention.
    pub fails_to_give_close_attention: Option<u8>,
    /// Does not listen when spoken to.
    pub does_not_listen_when_spoken_to: Option<u8>,
    /// Fails to follow through.
    pub fails_to_follow_through: Option<u8>,
    /// Difficulty organizing tasks.
    pub difficulty_organizing_tasks: Option<u8>,
    /// Avoids sustained mental effort.
    pub avoids_sustained_mental_effort: Option<u8>,
    /// Loses things necessary.
    pub loses_things_necessary: Option<u8>,
    /// Easily distracted.
    pub easily_distracted: Option<u8>,
    /// Forgetful in daily activities.
    pub forgetful_in_daily_activities: Option<u8>,
}

// ─── Hyperactivity-Impulsivity (Step 4) ─────────────────────

/// Hyperactivity impulsivity.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HyperactivityImpulsivity {
    /// Fidgets or squirms.
    pub fidgets_or_squirms: Option<u8>,
    /// Leaves seat unexpectedly.
    pub leaves_seat_unexpectedly: Option<u8>,
    /// Feels restless.
    pub feels_restless: Option<u8>,
    /// Difficulty engaging quietly.
    pub difficulty_engaging_quietly: Option<u8>,
    /// On the go driven by motor.
    pub on_the_go_driven_by_motor: Option<u8>,
    /// Talks excessively.
    pub talks_excessively: Option<u8>,
    /// Blurts out answers.
    pub blurts_out_answers: Option<u8>,
    /// Difficulty waiting turn.
    pub difficulty_waiting_turn: Option<u8>,
    /// Interrupts or intrudes.
    pub interrupts_or_intrudes: Option<u8>,
}

// ─── ASRS Screener (Step 5) ─────────────────────────────────

/// Asrs screener.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AsrsScreener {
    /// Asrs q1 wrapping up.
    pub asrs_q1_wrapping_up: Option<u8>,
    /// Asrs q2 difficulty ordering.
    pub asrs_q2_difficulty_ordering: Option<u8>,
    /// Asrs q3 difficulty remembering.
    pub asrs_q3_difficulty_remembering: Option<u8>,
    /// Asrs q4 avoids getting started.
    pub asrs_q4_avoids_getting_started: Option<u8>,
    /// Asrs q5 fidget squirm.
    pub asrs_q5_fidget_squirm: Option<u8>,
    /// Asrs q6 overly active.
    pub asrs_q6_overly_active: Option<u8>,
}

// ─── Functional Impact (Step 6) ─────────────────────────────

/// Functional impact.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalImpact {
    /// Work performance impact.
    pub work_performance_impact: Option<u8>,
    /// Academic impact.
    pub academic_impact: Option<u8>,
    /// Relationship impact.
    pub relationship_impact: Option<u8>,
    /// Social functioning impact.
    pub social_functioning_impact: Option<u8>,
    /// Financial management impact.
    pub financial_management_impact: Option<u8>,
    /// Driving safety concern.
    pub driving_safety_concern: Option<u8>,
    /// Daily task management.
    pub daily_task_management: Option<u8>,
    /// Self esteem impact.
    pub self_esteem_impact: Option<u8>,
}

// ─── Comorbidities (Step 7) ─────────────────────────────────

/// Comorbidities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Comorbidities {
    /// Anxiety symptoms.
    pub anxiety_symptoms: String,
    /// Depression symptoms.
    pub depression_symptoms: String,
    /// Mood disorder history.
    pub mood_disorder_history: String,
    /// Sleep disorder.
    pub sleep_disorder: String,
    /// Substance use current.
    pub substance_use_current: String,
    /// Substance use history.
    pub substance_use_history: String,
    /// Substance use details.
    pub substance_use_details: String,
    /// Autism spectrum traits.
    pub autism_spectrum_traits: String,
    /// Tic disorder.
    pub tic_disorder: String,
    /// Eating disorder.
    pub eating_disorder: String,
    /// Personality disorder traits.
    pub personality_disorder_traits: String,
    /// Other psychiatric conditions.
    pub other_psychiatric_conditions: String,
}

// ─── Previous Assessment (Step 8) ───────────────────────────

/// Previous assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PreviousAssessment {
    /// Previously assessed for adhd.
    pub previously_assessed_for_adhd: String,
    /// Previous assessment date.
    pub previous_assessment_date: String,
    /// Previous assessment result.
    pub previous_assessment_result: String,
    /// Previous assessment provider.
    pub previous_assessment_provider: String,
    /// Previous neuropsychological testing.
    pub previous_neuropsychological_testing: String,
    /// School assessment reports.
    pub school_assessment_reports: String,
    /// Informant reports available.
    pub informant_reports_available: String,
    /// Previous diagnosis other.
    pub previous_diagnosis_other: String,
}

// ─── Current Management (Step 9) ────────────────────────────

/// Current management.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CurrentManagement {
    /// Currently on medication.
    pub currently_on_medication: String,
    /// Current medication name.
    pub current_medication_name: String,
    /// Current medication dose.
    pub current_medication_dose: String,
    /// Medication effectiveness.
    pub medication_effectiveness: Option<u8>,
    /// Medication side effects.
    pub medication_side_effects: String,
    /// Previous adhd medications.
    pub previous_adhd_medications: String,
    /// Non pharmacological strategies.
    pub non_pharmacological_strategies: String,
    /// Cardiac history.
    pub cardiac_history: String,
    /// Blood pressure status.
    pub blood_pressure_status: String,
    /// Family cardiac history.
    pub family_cardiac_history: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Collateral history obtained.
    pub collateral_history_obtained: String,
    /// Collateral source.
    pub collateral_source: String,
    /// Mental state examination.
    pub mental_state_examination: String,
    /// Physical examination done.
    pub physical_examination_done: String,
    /// ECG done.
    pub ecg_done: String,
    /// Clinician impression.
    pub clinician_impression: String,
    /// Treatment plan.
    pub treatment_plan: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Developmental history.
    pub developmental_history: DevelopmentalHistory,
    /// Inattention symptoms.
    pub inattention_symptoms: InattentionSymptoms,
    /// Hyperactivity impulsivity.
    pub hyperactivity_impulsivity: HyperactivityImpulsivity,
    /// Asrs screener.
    pub asrs_screener: AsrsScreener,
    /// Functional impact.
    pub functional_impact: FunctionalImpact,
    /// Comorbidities.
    pub comorbidities: Comorbidities,
    /// Previous assessment.
    pub previous_assessment: PreviousAssessment,
    /// Current management.
    pub current_management: CurrentManagement,
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
    /// Likelihood level.
    pub likelihood_level: LikelihoodLevel,
    /// Asrs score.
    pub asrs_score: u8,
    /// Asrs positive count.
    pub asrs_positive_count: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
