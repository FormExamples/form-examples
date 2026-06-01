use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, FlagPriority};
use crate::models::_entities::assessments::Model;
use crate::views::assessment::ReportResult;

/// A single row in the clinician dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub created_at: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub postcode: String,
    pub gp_name: String,
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from a B1 assessment that has a result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: ReportResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| matches!(f.priority, FlagPriority::Urgent))
            .count() as u32;
        let high_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| matches!(f.priority, FlagPriority::High))
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            created_at: m.created_at.to_rfc3339(),
            full_name: data.personal_details.full_name,
            date_of_birth: data.personal_details.date_of_birth,
            postcode: data.personal_details.postcode,
            gp_name: data.healthcare_professionals.gp.gp_name,
            complete: result.validation.complete,
            total_required: result.validation.total_required,
            total_satisfied: result.validation.total_satisfied,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
