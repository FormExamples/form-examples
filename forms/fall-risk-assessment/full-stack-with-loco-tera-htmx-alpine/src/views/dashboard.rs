use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the fall-risk dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub created_at: String,
    pub patient_name: String,
    pub patient_date_of_birth: String,
    pub care_setting: String,
    pub primary_diagnosis: String,
    pub severity: String,
    pub mfs_score: i32,
    pub critical_override: bool,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed
    /// grading result.
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

        let patient_name = format!(
            "{} {}",
            data.demographics.first_name.trim(),
            data.demographics.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            created_at: m.created_at.to_rfc3339(),
            patient_name,
            patient_date_of_birth: data.demographics.date_of_birth,
            care_setting: data.demographics.care_setting,
            primary_diagnosis: data.demographics.primary_diagnosis,
            severity: result.severity,
            mfs_score: result.mfs_score,
            critical_override: result.critical_override,
            high_priority_flag_count,
        })
    }
}
