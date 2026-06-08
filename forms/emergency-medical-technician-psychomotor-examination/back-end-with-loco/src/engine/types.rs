//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Tri-state checklist response (mirrors front-end TriState):
//  - "yes"  : skill performed correctly (awards points)
//  - "no"   : skill not performed / incorrectly (no points)
//  - "na"   : item not applicable (excluded)
//  - ""     : examiner has not yet recorded an answer
/// Tri state.
pub type TriState = String;
/// Exam attempt.
pub type ExamAttempt = String; // "first-attempt" | "retest" | ""
/// Outcome.
pub type Outcome = String;     // "pass" | "fail" | ""

/// Step 1 — Candidate, Examiner & Scenario details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateExaminerScenario {
    /// Candidate first name.
    pub candidate_first_name: String,
    /// Candidate last name.
    pub candidate_last_name: String,
    /// Candidate ID.
    pub candidate_id: String,
    /// Attempt.
    pub attempt: ExamAttempt,
    /// Examiner name.
    pub examiner_name: String,
    /// Session date.
    pub session_date: String,
    /// Station location.
    pub station_location: String,
    /// Scenario summary.
    pub scenario_summary: String,
    /// Chief complaint given.
    pub chief_complaint_given: String,
}

/// Step 2 — Scene Size-Up.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SceneSizeUp {
    /// Ppe precautions.
    pub ppe_precautions: TriState,
    /// Scene safe.
    pub scene_safe: TriState,
    /// Mechanism or nature.
    pub mechanism_or_nature: TriState,
    /// Number of patients.
    pub number_of_patients: TriState,
    /// Additional resources.
    pub additional_resources: TriState,
    /// Considers cspine.
    pub considers_cspine: TriState,
}

/// Step 3 — Primary Survey.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrimarySurvey {
    /// General impression.
    pub general_impression: TriState,
    /// Mental status.
    pub mental_status: TriState,
    /// Airway.
    pub airway: TriState,
    /// Breathing.
    pub breathing: TriState,
    /// Oxygen therapy.
    pub oxygen_therapy: TriState,
    /// Circulation.
    pub circulation: TriState,
    /// Transport priority.
    pub transport_priority: TriState,
}

/// Step 4 — History Taking & Secondary Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistorySecondaryAssessment {
    /// Chief complaint.
    pub chief_complaint: TriState,
    /// History onset opqrst.
    pub history_onset_opqrst: TriState,
    /// Sample signs symptoms.
    pub sample_signs_symptoms: TriState,
    /// Sample allergies.
    pub sample_allergies: TriState,
    /// Sample medications.
    pub sample_medications: TriState,
    /// Sample past history.
    pub sample_past_history: TriState,
    /// Sample last intake.
    pub sample_last_intake: TriState,
    /// Sample events.
    pub sample_events: TriState,
    /// Focused exam.
    pub focused_exam: TriState,
    /// Baseline vitals BP.
    pub baseline_vitals_bp: TriState,
    /// Baseline vitals pulse.
    pub baseline_vitals_pulse: TriState,
    /// Baseline vitals respirations.
    pub baseline_vitals_respirations: TriState,
    /// Field impression.
    pub field_impression: TriState,
    /// Interventions.
    pub interventions: TriState,
}

/// Step 5 — Reassessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reassessment {
    /// Repeats mental status.
    pub repeats_mental_status: TriState,
    /// Repeats airway.
    pub repeats_airway: TriState,
    /// Repeats breathing.
    pub repeats_breathing: TriState,
    /// Repeats circulation.
    pub repeats_circulation: TriState,
    /// Repeats vitals.
    pub repeats_vitals: TriState,
    /// Repeats focused exam.
    pub repeats_focused_exam: TriState,
    /// Evaluates interventions.
    pub evaluates_interventions: TriState,
    /// Transport interventions.
    pub transport_interventions: TriState,
    /// Fifteen minute call.
    pub fifteen_minute_call: TriState,
}

/// Step 6 — Critical Criteria Review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CriticalCriteriaReview {
    /// Dangerous intervention.
    pub dangerous_intervention: TriState,
    /// Spinal protection.
    pub spinal_protection: TriState,
    /// Examiner notes.
    pub examiner_notes: String,
    /// Debrief notes.
    pub debrief_notes: String,
}

/// Full NREMT EMT Psychomotor Skills Examination record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Candidate examiner scenario.
    pub candidate_examiner_scenario: CandidateExaminerScenario,
    /// Scene size up.
    pub scene_size_up: SceneSizeUp,
    /// Primary survey.
    pub primary_survey: PrimarySurvey,
    /// History secondary assessment.
    pub history_secondary_assessment: HistorySecondaryAssessment,
    /// Reassessment.
    pub reassessment: Reassessment,
    /// Critical criteria review.
    pub critical_criteria_review: CriticalCriteriaReview,
}

/// A rule that has been evaluated against the data.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Step.
    pub step: u32,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Critical.
    pub critical: bool,
    /// Points.
    pub points: u32,
    /// Status.
    pub status: TriState,
    /// Points awarded.
    pub points_awarded: u32,
}

/// A safety / debrief flag surfaced by the report.
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
    pub priority: String, // "high" | "medium" | "low"
}

/// Final grading output.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Outcome.
    pub outcome: Outcome,
    /// Points.
    pub points: u32,
    /// Max points.
    pub max_points: u32,
    /// Percent.
    pub percent: f64,
    /// Critical failures.
    pub critical_failures: Vec<FiredRule>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Answered count.
    pub answered_count: u32,
    /// Total rules.
    pub total_rules: u32,
    /// Timestamp.
    pub timestamp: String,
}

/// NREMT pass threshold: at least 80% of max points and no critical failure.
pub const PASS_PERCENT_THRESHOLD: f64 = 80.0;
