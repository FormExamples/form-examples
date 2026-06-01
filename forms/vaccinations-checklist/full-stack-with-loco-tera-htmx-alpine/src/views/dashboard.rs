use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the vaccinations dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub occupation: String,
    pub occupation_category: String,
    pub employer: String,
    pub compliance_status: String,
    pub overall_risk: String,
    pub fired_rule_count: u32,
    pub high_priority_flag_count: u32,
    pub missing_vaccination_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from a vaccinations checklist model that has a
    /// completed grading result.
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
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            occupation: data.demographics.occupation,
            occupation_category: data.demographics.occupation_category,
            employer: data.demographics.employer,
            compliance_status: result.compliance_status,
            overall_risk: result.overall_risk,
            fired_rule_count: result.fired_rules.len() as u32,
            high_priority_flag_count,
            missing_vaccination_count: result.missing_vaccinations.len() as u32,
        })
    }
}
