use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the training-coordinator dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateRow {
    pub id: String,
    pub session_date: String,
    pub candidate_first_name: String,
    pub candidate_last_name: String,
    pub candidate_id: String,
    pub venue_name: String,
    pub venue_type: String,
    pub assessment_type: String,
    pub examiner_name: String,
    pub outcome: String,
    pub critical_failure_count: u32,
    pub deficiency_count: u32,
    pub high_priority_flag_count: u32,
}

impl CandidateRow {
    /// Build a row from a completed assessment model.
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
            session_date: data.candidate_details.session_date,
            candidate_first_name: data.candidate_details.first_name,
            candidate_last_name: data.candidate_details.last_name,
            candidate_id: data.candidate_details.candidate_id,
            venue_name: data.candidate_details.venue_name,
            venue_type: data.candidate_details.venue_type,
            assessment_type: data.candidate_details.assessment_type,
            examiner_name: data.candidate_details.examiner_name,
            outcome: result.outcome,
            critical_failure_count: result.critical_failures.len() as u32,
            deficiency_count: result.deficiencies.len() as u32,
            high_priority_flag_count,
        })
    }
}
