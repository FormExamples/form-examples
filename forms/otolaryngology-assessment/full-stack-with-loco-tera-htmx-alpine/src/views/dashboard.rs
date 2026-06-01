use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the ENT clinic dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub date_of_birth: String,
    pub first_name: String,
    pub last_name: String,
    pub sex: String,
    pub occupation: String,
    pub chief_complaint: String,
    pub working_diagnosis: String,
    pub total_score: i32,
    pub severity_level: String,
    pub urgent_flag_count: i32,
    pub high_priority_flag_count: i32,
}

impl CaseRow {
    /// Build a CaseRow from a model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "urgent")
            .count() as i32;

        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as i32;

        Some(Self {
            id: m.id.to_string(),
            date_of_birth: data.demographics.date_of_birth,
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            sex: data.demographics.sex,
            occupation: data.demographics.occupation,
            chief_complaint: data.presenting_complaint.chief_complaint,
            working_diagnosis: data.clinical_impression_plan.working_diagnosis,
            total_score: result.total_score,
            severity_level: result.severity_level,
            urgent_flag_count,
            high_priority_flag_count,
        })
    }
}
