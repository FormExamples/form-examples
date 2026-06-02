use serde::{Deserialize, Serialize};

// Tri-state checklist response (mirrors front-end TriState):
//  - "yes"  : skill performed correctly (awards points)
//  - "no"   : skill not performed / incorrectly (no points)
//  - "na"   : item not applicable (excluded)
//  - ""     : examiner has not yet recorded an answer
pub type TriState = String;
pub type ExamAttempt = String; // "first-attempt" | "retest" | ""
pub type Outcome = String;     // "pass" | "fail" | ""

/// Step 1 — Candidate, Examiner & Scenario details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateExaminerScenario {
    pub candidate_first_name: String,
    pub candidate_last_name: String,
    pub candidate_id: String,
    pub attempt: ExamAttempt,
    pub examiner_name: String,
    pub session_date: String,
    pub station_location: String,
    pub scenario_summary: String,
    pub chief_complaint_given: String,
}

/// Step 2 — Scene Size-Up.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SceneSizeUp {
    pub ppe_precautions: TriState,
    pub scene_safe: TriState,
    pub mechanism_or_nature: TriState,
    pub number_of_patients: TriState,
    pub additional_resources: TriState,
    pub considers_cspine: TriState,
}

/// Step 3 — Primary Survey.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PrimarySurvey {
    pub general_impression: TriState,
    pub mental_status: TriState,
    pub airway: TriState,
    pub breathing: TriState,
    pub oxygen_therapy: TriState,
    pub circulation: TriState,
    pub transport_priority: TriState,
}

/// Step 4 — History Taking & Secondary Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistorySecondaryAssessment {
    pub chief_complaint: TriState,
    pub history_onset_opqrst: TriState,
    pub sample_signs_symptoms: TriState,
    pub sample_allergies: TriState,
    pub sample_medications: TriState,
    pub sample_past_history: TriState,
    pub sample_last_intake: TriState,
    pub sample_events: TriState,
    pub focused_exam: TriState,
    pub baseline_vitals_bp: TriState,
    pub baseline_vitals_pulse: TriState,
    pub baseline_vitals_respirations: TriState,
    pub field_impression: TriState,
    pub interventions: TriState,
}

/// Step 5 — Reassessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reassessment {
    pub repeats_mental_status: TriState,
    pub repeats_airway: TriState,
    pub repeats_breathing: TriState,
    pub repeats_circulation: TriState,
    pub repeats_vitals: TriState,
    pub repeats_focused_exam: TriState,
    pub evaluates_interventions: TriState,
    pub transport_interventions: TriState,
    pub fifteen_minute_call: TriState,
}

/// Step 6 — Critical Criteria Review.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CriticalCriteriaReview {
    pub dangerous_intervention: TriState,
    pub spinal_protection: TriState,
    pub examiner_notes: String,
    pub debrief_notes: String,
}

/// Full NREMT EMT Psychomotor Skills Examination record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub candidate_examiner_scenario: CandidateExaminerScenario,
    pub scene_size_up: SceneSizeUp,
    pub primary_survey: PrimarySurvey,
    pub history_secondary_assessment: HistorySecondaryAssessment,
    pub reassessment: Reassessment,
    pub critical_criteria_review: CriticalCriteriaReview,
}

/// A rule that has been evaluated against the data.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub step: u32,
    pub category: String,
    pub description: String,
    pub critical: bool,
    pub points: u32,
    pub status: TriState,
    pub points_awarded: u32,
}

/// A safety / debrief flag surfaced by the report.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String, // "high" | "medium" | "low"
}

/// Final grading output.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub outcome: Outcome,
    pub points: u32,
    pub max_points: u32,
    pub percent: f64,
    pub critical_failures: Vec<FiredRule>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub answered_count: u32,
    pub total_rules: u32,
    pub timestamp: String,
}

/// NREMT pass threshold: at least 80% of max points and no critical failure.
pub const PASS_PERCENT_THRESHOLD: f64 = 80.0;
