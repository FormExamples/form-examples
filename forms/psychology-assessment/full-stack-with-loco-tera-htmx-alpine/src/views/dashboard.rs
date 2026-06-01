use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the clinician dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub created_at: String,
    pub patient_name: String,
    pub date_of_birth: String,
    pub primary_concern: String,
    pub depression_scaled: i32,
    pub depression_severity: String,
    pub anxiety_scaled: i32,
    pub anxiety_severity: String,
    pub stress_scaled: i32,
    pub stress_severity: String,
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
            created_at: m.created_at.to_rfc3339(),
            patient_name,
            date_of_birth: data.demographics.date_of_birth,
            primary_concern: data.reason_for_assessment.primary_concern,
            depression_scaled: result.depression.scaled,
            depression_severity: result.depression.severity,
            anxiety_scaled: result.anxiety.scaled,
            anxiety_severity: result.anxiety.severity,
            stress_scaled: result.stress.scaled,
            stress_severity: result.stress.severity,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
