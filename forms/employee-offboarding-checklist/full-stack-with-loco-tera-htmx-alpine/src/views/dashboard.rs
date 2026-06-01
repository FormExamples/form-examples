use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, ValidationResult};
use crate::models::_entities::assessments::Model;

/// A single row in the HR offboarding dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub employee_id: String,
    pub job_title: String,
    pub department: String,
    pub line_manager: String,
    pub last_working_day: String,
    pub reason_for_leaving: String,
    pub outcome: String,
    pub completion_percent: f64,
    pub blocker_count: u32,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed validation result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: ValidationResult = m
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
            first_name: data.employee_details.first_name,
            last_name: data.employee_details.last_name,
            employee_id: data.employee_details.employee_id,
            job_title: data.employee_details.job_title,
            department: data.employee_details.department,
            line_manager: data.employee_details.line_manager,
            last_working_day: data.employee_details.last_working_day,
            reason_for_leaving: data.employee_details.reason_for_leaving,
            outcome: result.outcome,
            completion_percent: result.completion_percent,
            blocker_count: result.blockers.len() as u32,
            high_priority_flag_count,
        })
    }
}
