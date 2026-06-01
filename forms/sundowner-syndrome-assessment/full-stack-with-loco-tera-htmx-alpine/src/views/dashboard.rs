use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the sundowner-assessment dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub age_years: Option<i32>,
    pub primary_diagnosis: String,
    pub care_setting: String,
    pub severity: String,
    pub cmai_score: i32,
    pub npi_score: i32,
    pub high_priority_flag_count: u32,
    pub timestamp: String,
}

impl CaseRow {
    /// Build a CaseRow from an assessment row that has a completed grading result.
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
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            age_years: data.demographics.age_years,
            primary_diagnosis: data.demographics.primary_diagnosis,
            care_setting: data.demographics.care_setting,
            severity: result.severity,
            cmai_score: result.cmai_score,
            npi_score: result.npi_score,
            high_priority_flag_count,
            timestamp: result.timestamp,
        })
    }
}
