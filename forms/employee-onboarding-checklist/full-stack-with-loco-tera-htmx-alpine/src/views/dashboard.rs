use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the HR dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmployeeRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub job_title: String,
    pub department: String,
    pub start_date: String,
    pub email: String,
    pub completion_status: String,
    pub completion_percentage: f64,
    pub overall_risk: String,
    pub high_priority_flag_count: u32,
}

impl EmployeeRow {
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
            job_title: data.demographics.job_title,
            department: data.demographics.department,
            start_date: data.demographics.start_date,
            email: data.demographics.email,
            completion_status: result.completion_status,
            completion_percentage: result.completion_percentage,
            overall_risk: result.overall_risk,
            high_priority_flag_count,
        })
    }
}
