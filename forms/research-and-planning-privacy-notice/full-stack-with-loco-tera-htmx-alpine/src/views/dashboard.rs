use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the information-governance dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgementRow {
    pub id: String,
    pub organisation_name: String,
    pub recipient_name: String,
    pub recipient_nhs_number: String,
    pub recipient_dob: String,
    pub agreed: bool,
    pub type1_opt_out: String,
    pub national_data_opt_out: String,
    pub recipient_typed_full_name: String,
    pub recipient_typed_date: String,
    pub status: String,
    pub completeness_percent: u32,
    pub high_priority_flag_count: u32,
}

impl AcknowledgementRow {
    /// Build a dashboard row from a completed acknowledgement model.
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
            recipient_nhs_number: data.recipient_details.recipient_nhs_number,
            recipient_dob: data.recipient_details.recipient_dob,
            agreed: data.acknowledgement_signature.agreed,
            type1_opt_out: data.acknowledgement_signature.type1_opt_out,
            national_data_opt_out: data.acknowledgement_signature.national_data_opt_out,
            recipient_typed_full_name: data.acknowledgement_signature.recipient_typed_full_name,
            recipient_typed_date: data.acknowledgement_signature.recipient_typed_date,
            status: result.status,
            completeness_percent: result.completeness_percent,
            high_priority_flag_count,
        })
    }
}
