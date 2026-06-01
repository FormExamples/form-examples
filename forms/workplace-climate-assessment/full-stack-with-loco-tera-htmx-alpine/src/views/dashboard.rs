use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the leadership dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub created_at: String,
    pub department: String,
    pub tenure_band: String,
    pub role_level: String,
    pub work_location: String,
    pub composite_score: Option<f64>,
    pub category: String,
    pub answered_count: u32,
    pub total_count: u32,
    pub high_priority_flag_count: u32,
    pub recommend_as_place_to_work: String,
}

impl CaseRow {
    /// Build a CaseRow from a model that has a completed grading result.
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
            created_at: m.created_at.to_rfc3339(),
            department: data.demographics.department,
            tenure_band: data.demographics.tenure_band,
            role_level: data.demographics.role_level,
            work_location: data.demographics.work_location,
            composite_score: result.composite_score,
            category: result.category,
            answered_count: result.answered_count,
            total_count: result.total_count,
            high_priority_flag_count,
            recommend_as_place_to_work: data.overall.recommend_as_place_to_work,
        })
    }
}
