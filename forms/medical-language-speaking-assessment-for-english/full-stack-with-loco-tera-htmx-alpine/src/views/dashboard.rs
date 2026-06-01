use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the OET examiner dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub test_date: String,
    pub test_centre: String,
    pub candidate_name: String,
    pub candidate_id: String,
    pub examiner_name: String,
    pub profession: String,
    pub first_language: String,
    pub country_of_training: String,
    pub scaled_score: u32,
    pub grade: String,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a `CaseRow` from a model that has a completed grading result.
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
            test_date: data.candidate.test_date,
            test_centre: data.candidate.test_centre,
            candidate_name: data.candidate.candidate_name,
            candidate_id: data.candidate.candidate_id,
            examiner_name: data.candidate.examiner_name,
            profession: data.candidate.profession,
            first_language: data.candidate.first_language,
            country_of_training: data.candidate.country_of_training,
            scaled_score: result.scaled_score,
            grade: result.grade,
            high_priority_flag_count,
        })
    }
}
