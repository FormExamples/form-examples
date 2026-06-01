use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the Learning Disability dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub date_of_birth: String,
    pub nhs_number: String,
    pub gp_practice: String,
    pub severity_category: String,
    pub adaptive_score: f64,
    pub answered_count: i32,
    pub high_priority_flag_count: u32,
    pub urgent_flag_count: u32,
    pub timestamp: String,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model with a completed grading result.
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
        let urgent_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "urgent")
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
            nhs_number: data.demographics.nhs_number,
            gp_practice: data.demographics.gp_practice,
            severity_category: result.severity_category,
            adaptive_score: result.adaptive_score,
            answered_count: result.answered_count,
            high_priority_flag_count,
            urgent_flag_count,
            timestamp: result.timestamp,
        })
    }
}
