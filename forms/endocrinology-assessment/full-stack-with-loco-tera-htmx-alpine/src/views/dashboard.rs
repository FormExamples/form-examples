use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the endocrinology clinic dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub overall_status: String,
    pub answered_count: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "urgent")
            .count() as u32;
        let high_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.demographics.first_name.trim(),
            data.demographics.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            patient_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            overall_status: result.overall_status,
            answered_count: result.answered_count,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
