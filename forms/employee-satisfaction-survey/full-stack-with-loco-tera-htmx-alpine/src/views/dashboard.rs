use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the HR / engagement dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseRow {
    pub id: String,
    pub created_at: String,
    pub department: String,
    pub tenure_band: String,
    pub hours_band: String,
    pub role_level: String,
    pub work_location: String,
    pub retention_intent: String,
    pub composite_score: Option<f64>,
    pub category: String,
    pub enps_score: Option<i32>,
    pub enps_classification: String,
    pub high_priority_flag_count: u32,
}

impl ResponseRow {
    /// Build a ResponseRow from a model that has a completed grading result.
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
            hours_band: data.demographics.hours_band,
            role_level: data.role_tenure.role_level,
            work_location: data.role_tenure.work_location,
            retention_intent: data.overall.retention_intent,
            composite_score: result.composite_score,
            category: result.category,
            enps_score: result.enps.score,
            enps_classification: result.enps.classification,
            high_priority_flag_count,
        })
    }
}
