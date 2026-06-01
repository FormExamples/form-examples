use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the organ-donation dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub assessment_date: String,
    pub donor_name: String,
    pub donor_type: String,
    pub date_of_birth: String,
    pub intended_organs: String,
    pub eligibility: String,
    pub risk_level: String,
    pub assessor_name: String,
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
            data.demographics.first_name.trim(),
            data.demographics.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            assessment_date: data.eligibility_allocation.assessment_date,
            donor_name,
            donor_type: data.donor_type_registration.donor_type,
            date_of_birth: data.demographics.date_of_birth,
            intended_organs: data.donor_type_registration.intended_organs,
            eligibility: result.eligibility,
            risk_level: result.risk_level,
            assessor_name: data.eligibility_allocation.assessor_name,
            high_priority_flag_count,
        })
    }
}
