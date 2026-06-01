use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the DVLA V1 dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub postcode: String,
    pub gp_name: String,
    pub meets_standard: String,
    pub overall_percent: u32,
    pub flagged_issue_count: u32,
    pub urgent_flag_count: u32,
    pub created_at: String,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let flagged_issue_count = result.flagged_issues.len() as u32;
        let urgent_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| f.priority == "urgent")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            full_name: data.personal_details.full_name,
            date_of_birth: data.personal_details.date_of_birth,
            postcode: data.personal_details.postcode,
            gp_name: data.healthcare_professionals.gp.name,
            meets_standard: data.eyesight_standards.meets_standard,
            overall_percent: result.overall_percent,
            flagged_issue_count,
            urgent_flag_count,
            created_at: m.created_at.to_rfc3339(),
        })
    }
}
