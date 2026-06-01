use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the compliance dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgementRow {
    pub id: String,
    pub organisation_name: String,
    pub recipient_name: String,
    pub recipient_role: String,
    pub recipient_typed_date: String,
    pub status: String,
    pub completeness_percent: u32,
    pub high_priority_flag_count: u32,
}

impl AcknowledgementRow {
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
            organisation_name: data.recipient_details.organisation_name,
            recipient_name: data.recipient_details.recipient_name,
            recipient_role: data.recipient_details.recipient_role,
            recipient_typed_date: data.acknowledgement_signature.recipient_typed_date,
            status: result.status,
            completeness_percent: result.completeness_percent,
            high_priority_flag_count,
        })
    }
}
