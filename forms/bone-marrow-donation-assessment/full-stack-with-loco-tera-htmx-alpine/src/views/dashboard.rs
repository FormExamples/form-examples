use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the donor-assessment dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub assessment_date: String,
    pub donor_name: String,
    pub donor_registry: String,
    pub donor_registry_id: String,
    pub donation_type: String,
    pub hla_match_level: String,
    pub eligibility: String,
    pub overall_risk: String,
    pub collection_method: String,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
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

        let donor_name = format!(
            "{} {}",
            data.demographics.first_name, data.demographics.last_name
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            assessment_date: data.consent_eligibility.assessment_date,
            donor_name,
            donor_registry: data.donor_registration_hla_typing.donor_registry,
            donor_registry_id: data.donor_registration_hla_typing.donor_registry_id,
            donation_type: data.donor_registration_hla_typing.donation_type,
            hla_match_level: result.hla_match_level,
            eligibility: result.eligibility,
            overall_risk: result.overall_risk,
            collection_method: result.collection_method,
            high_priority_flag_count,
        })
    }
}
