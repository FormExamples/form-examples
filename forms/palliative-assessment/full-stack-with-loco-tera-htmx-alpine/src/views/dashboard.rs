use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the palliative dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub assessment_date: String,
    pub patient_name: String,
    pub nhs_or_mrn_number: String,
    pub primary_diagnosis: String,
    pub prognosis_horizon: String,
    pub severity_band: String,
    pub esas_total: i32,
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

        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.demographics.first_name, data.demographics.last_name
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            assessment_date: data.demographics.assessment_date,
            patient_name,
            nhs_or_mrn_number: data.demographics.nhs_or_mrn_number,
            primary_diagnosis: data.primary_diagnosis_prognosis.primary_diagnosis,
            prognosis_horizon: data.primary_diagnosis_prognosis.prognosis_horizon,
            severity_band: result.severity_band,
            esas_total: result.esas_total,
            high_priority_flag_count,
        })
    }
}
