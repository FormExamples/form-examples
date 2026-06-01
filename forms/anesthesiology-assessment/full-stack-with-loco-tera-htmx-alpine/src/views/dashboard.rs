use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the anaesthetist dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub patient_nhs_number: String,
    pub procedure_name: String,
    pub surgery_date: String,
    pub surgery_grade: String,
    pub asa_class: String,
    pub overall_risk: String,
    pub high_priority_flag_count: u32,
    pub urgent_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
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
            .count() as u32;
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
            patient_name,
            patient_nhs_number: data.demographics.nhs_number,
            procedure_name: data.planned_surgery.procedure_name,
            surgery_date: data.planned_surgery.surgery_date,
            surgery_grade: data.planned_surgery.surgery_grade,
            asa_class: data.investigations_and_plan.asa_class,
            overall_risk: result.overall_risk,
            high_priority_flag_count,
            urgent_flag_count,
        })
    }
}
