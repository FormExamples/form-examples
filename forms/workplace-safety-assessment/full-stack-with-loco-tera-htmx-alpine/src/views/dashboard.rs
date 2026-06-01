use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the safety-officer dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub audit_date: String,
    pub site_name: String,
    pub department_area: String,
    pub auditor_name: String,
    pub site_manager: String,
    pub outcome: String,
    pub fired_rule_count: u32,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model with a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high" || f.priority == "urgent")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            audit_date: data.site_details.audit_date,
            site_name: data.site_details.site_name,
            department_area: data.site_details.department_area,
            auditor_name: data.site_details.auditor_name,
            site_manager: data.site_details.site_manager,
            outcome: result.outcome,
            fired_rule_count: result.fired_rules.len() as u32,
            high_priority_flag_count,
        })
    }
}
