use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the practice acknowledgment dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgmentRow {
    pub id: String,
    pub patient_name: String,
    pub patient_nhs_number: String,
    pub full_name: String,
    pub acknowledged_date: String,
    pub practice_name: String,
    pub acknowledgment_status: String,
    pub overall_percent: u32,
    pub high_priority_flag_count: u32,
}

impl AcknowledgmentRow {
    /// Build a row from a model that has a completed grading result.
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
            patient_name: data.patient.name,
            patient_nhs_number: data.patient.united_kingdom_nhs_number,
            full_name: data.acknowledgment.full_name,
            acknowledged_date: data.acknowledgment.acknowledged_date,
            practice_name: data.practice_config.practice_name,
            acknowledgment_status: result.acknowledgment_status,
            overall_percent: result.overall_percent,
            high_priority_flag_count,
        })
    }
}
