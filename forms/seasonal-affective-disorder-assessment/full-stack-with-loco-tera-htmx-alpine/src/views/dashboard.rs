use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row on the clinician dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub date_of_birth: String,
    pub country: String,
    pub spaq_score: i32,
    pub spaq_band: String,
    pub phq9_score: i32,
    pub phq9_band: String,
    pub combined_severity: String,
    pub high_priority_flag_count: u32,
    pub created_at: String,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
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
            country: data.demographics.country,
            spaq_score: result.spaq_score,
            spaq_band: result.spaq_band,
            phq9_score: result.phq9_score,
            phq9_band: result.phq9_band,
            combined_severity: result.combined_severity,
            high_priority_flag_count,
            created_at: m.created_at.to_rfc3339(),
        })
    }
}
