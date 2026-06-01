use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the occupational-health dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentRow {
    pub id: String,
    pub timestamp: String,
    pub department: String,
    pub tenure_band: String,
    pub hours_band: String,
    pub overall_risk: String,
    pub answered_count: u32,
    pub high_priority_flag_count: u32,
}

impl AssessmentRow {
    /// Build an AssessmentRow from a model that has a completed grading result.
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
            timestamp: result.timestamp,
            department: data.demographics.department,
            tenure_band: data.demographics.tenure_band,
            hours_band: data.demographics.hours_band,
            overall_risk: result.overall_risk,
            answered_count: result.answered_count,
            high_priority_flag_count,
        })
    }
}
