use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the dashboard listing.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub event_description: String,
    pub event_date: String,
    pub is_ongoing: bool,
    pub total_score: i32,
    pub category: String,
    pub probable_dsm5_diagnosis: bool,
    pub urgent_flag_count: u32,
    pub timestamp: String,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed result.
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

        Some(Self {
            id: m.id.to_string(),
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            event_description: data.trauma_event.event_description,
            event_date: data.trauma_event.event_date,
            is_ongoing: data.trauma_event.is_ongoing,
            total_score: result.total_score,
            category: result.category,
            probable_dsm5_diagnosis: result.probable_dsm5_diagnosis,
            urgent_flag_count,
            timestamp: result.timestamp,
        })
    }
}
