use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingReport};
use crate::models::_entities::assessments::Model;

/// A single row in the examiner dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub test_date: String,
    pub candidate_id: String,
    pub candidate_name: String,
    pub examiner_name: String,
    pub test_centre: String,
    pub first_language: String,
    pub country_of_training: String,
    pub grade: String,
    pub scaled_score: i32,
    pub linguistic_total: f64,
    pub clinical_total: f64,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model with a graded result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let report: GradingReport = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let high_priority_flag_count = report
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            test_date: data.candidate.test_date,
            candidate_id: data.candidate.candidate_id,
            candidate_name: data.candidate.candidate_name,
            examiner_name: data.candidate.examiner_name,
            test_centre: data.candidate.test_centre,
            first_language: data.candidate.first_language,
            country_of_training: data.candidate.country_of_training,
            grade: report.grading.grade,
            scaled_score: report.grading.scaled_score,
            linguistic_total: report.grading.linguistic_total,
            clinical_total: report.grading.clinical_total,
            high_priority_flag_count,
        })
    }
}
