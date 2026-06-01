use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::engine::utils::severity_label;
use crate::models::_entities::assessments::Model;

/// A single row in the dyslexia-assessment dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub created_at: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub referral_source: String,
    pub overall_severity: String,
    pub overall_severity_label: String,
    pub lowest_score: Option<i32>,
    pub answered_count: u32,
    pub high_priority_flag_count: u32,
    pub total_flag_count: u32,
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
            .filter(|f| f.priority == "high" || f.priority == "urgent")
            .count() as u32;
        let total_flag_count = result.additional_flags.len() as u32;
        let label = severity_label(&result.overall_severity);

        Some(Self {
            id: m.id.to_string(),
            created_at: m.created_at.to_rfc3339(),
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            referral_source: data.demographics.referral_source,
            overall_severity: result.overall_severity,
            overall_severity_label: label,
            lowest_score: result.lowest_score,
            answered_count: result.answered_count,
            high_priority_flag_count,
            total_flag_count,
        })
    }
}
