use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the operator dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferRow {
    pub id: String,
    pub patient_name: String,
    pub patient_nhs_number: String,
    pub primary_diagnosis: String,
    pub urgency: String,
    pub transfer_type: String,
    pub requesting_clinician: String,
    pub requesting_organisation: String,
    pub receiving_clinician: String,
    pub receiving_organisation: String,
    pub completeness: String,
    pub mandatory_satisfied: u32,
    pub mandatory_required: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl TransferRow {
    /// Build a TransferRow from a model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .flags
            .iter()
            .filter(|f| f.priority == "urgent")
            .count() as u32;
        let high_flag_count = result
            .flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.patient_demographics.first_name.trim(),
            data.patient_demographics.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            patient_name,
            patient_nhs_number: data.patient_demographics.nhs_number,
            primary_diagnosis: data.situation.primary_diagnosis,
            urgency: data.situation.urgency,
            transfer_type: data.situation.transfer_type,
            requesting_clinician: data.requesting_provider.clinician_name,
            requesting_organisation: data.requesting_provider.organisation,
            receiving_clinician: data.receiving_provider.clinician_name,
            receiving_organisation: data.receiving_provider.organisation,
            completeness: result.validation.completeness,
            mandatory_satisfied: result.validation.mandatory_satisfied,
            mandatory_required: result.validation.mandatory_required,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
