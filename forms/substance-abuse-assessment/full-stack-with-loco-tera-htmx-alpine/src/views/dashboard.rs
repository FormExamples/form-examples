use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the substance abuse assessment dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub created_at: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub primary_substance: String,
    pub current_use_status: String,
    pub audit_score: i32,
    pub audit_risk_category: String,
    pub dast_score: i32,
    pub dast_risk_category: String,
    pub overall_risk: String,
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
            .filter(|f| f.priority == "high")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            created_at: m.created_at.to_rfc3339(),
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            primary_substance: data.substance_use_history.primary_substance,
            current_use_status: data.substance_use_history.current_use_status,
            audit_score: result.audit_score,
            audit_risk_category: result.audit_risk_category,
            dast_score: result.dast_score,
            dast_risk_category: result.dast_risk_category,
            overall_risk: result.overall_risk,
            high_priority_flag_count,
        })
    }
}
