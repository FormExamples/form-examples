use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the IPS dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub patient_date_of_birth: String,
    pub patient_country: String,
    pub authoring_clinician: String,
    pub authoring_organisation: String,
    pub authoring_status: String,
    pub completeness_level: String,
    pub mandatory_populated: u32,
    pub mandatory_total: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
    pub signoff_date: String,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a grading result.
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
        let high_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.patient_demographics.given_name, data.patient_demographics.family_name
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            patient_name,
            patient_date_of_birth: data.patient_demographics.date_of_birth,
            patient_country: data.patient_demographics.country,
            authoring_clinician: data.authoring_clinician.clinician_name,
            authoring_organisation: data.authoring_clinician.organisation,
            authoring_status: data.authoring_clinician.authoring_status,
            completeness_level: result.completeness_level,
            mandatory_populated: result.mandatory_populated,
            mandatory_total: result.mandatory_total,
            urgent_flag_count,
            high_flag_count,
            signoff_date: data.authoring_clinician.signoff_date,
        })
    }
}
