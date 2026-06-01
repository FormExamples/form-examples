use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the practice dashboard listing.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub practice_name: String,
    pub patient_name: String,
    pub date: String,
    pub overall_status: String,
    pub high_priority_flag_count: u32,
    pub medium_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an acknowledgement model with a completed grading
    /// result.
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
        let medium_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "medium")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            practice_name: data.config.practice_name,
            patient_name: data.acknowledgment.patient_name,
            date: data.acknowledgment.date,
            overall_status: result.overall_status,
            high_priority_flag_count,
            medium_priority_flag_count,
        })
    }
}
