use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the training-coordinator dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub session_date: String,
    pub candidate_first_name: String,
    pub candidate_last_name: String,
    pub candidate_id: String,
    pub attempt: String,
    pub examiner_name: String,
    pub station_location: String,
    pub outcome: String,
    pub points: u32,
    pub max_points: u32,
    pub percent: f64,
    pub critical_failure_count: u32,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model with a grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            session_date: data.candidate_examiner_scenario.session_date,
            candidate_first_name: data.candidate_examiner_scenario.candidate_first_name,
            candidate_last_name: data.candidate_examiner_scenario.candidate_last_name,
            candidate_id: data.candidate_examiner_scenario.candidate_id,
            attempt: data.candidate_examiner_scenario.attempt,
            examiner_name: data.candidate_examiner_scenario.examiner_name,
            station_location: data.candidate_examiner_scenario.station_location,
            outcome: result.outcome,
            points: result.points,
            max_points: result.max_points,
            percent: result.percent,
            critical_failure_count: result.critical_failures.len() as u32,
            high_priority_flag_count,
        })
    }
}
