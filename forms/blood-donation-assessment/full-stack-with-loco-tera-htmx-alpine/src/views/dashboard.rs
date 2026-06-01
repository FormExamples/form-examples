use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the donor-session dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DonorRow {
    pub id: String,
    pub donor_name: String,
    pub donor_type: String,
    pub sex: String,
    pub date_of_birth: String,
    pub eligibility_status: String,
    pub deferral_window: String,
    pub urgent_flag_count: u32,
    pub fired_rule_count: u32,
    pub answered_count: u32,
}

impl DonorRow {
    /// Build a `DonorRow` from a model that has a completed grading result.
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

        let donor_name = format!(
            "{} {}",
            data.donor_demographics.first_name, data.donor_demographics.last_name
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            donor_name,
            donor_type: data.donor_demographics.donor_type,
            sex: data.donor_demographics.sex,
            date_of_birth: data.donor_demographics.date_of_birth,
            eligibility_status: result.eligibility_status,
            deferral_window: result.deferral_window,
            urgent_flag_count,
            fired_rule_count: result.fired_rules.len() as u32,
            answered_count: result.answered_count,
        })
    }
}
