use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the post-operative reports dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub date_of_surgery: String,
    pub patient_name: String,
    pub mrn: String,
    pub procedure_name: String,
    pub procedure_priority: String,
    pub asa_grade: String,
    pub primary_surgeon: String,
    pub primary_anaesthetist: String,
    pub disposition: String,
    pub overall_grade: String,
    pub complication_count: u32,
    pub urgent_flag_count: u32,
    pub high_priority_flag_count: u32,
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
            data.patient_details.first_name.trim(),
            data.patient_details.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            date_of_surgery: data.procedure_details.date_of_surgery,
            patient_name,
            mrn: data.patient_details.mrn,
            procedure_name: data.procedure_details.procedure_name,
            procedure_priority: data.procedure_details.priority,
            asa_grade: data.patient_details.asa_grade,
            primary_surgeon: data.surgical_team.primary_surgeon,
            primary_anaesthetist: data.surgical_team.primary_anaesthetist,
            disposition: data.immediate_postop_status.disposition,
            overall_grade: result.overall_grade,
            complication_count: result.complication_count,
            urgent_flag_count,
            high_priority_flag_count,
        })
    }
}
