use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, ValidationResult};
use crate::models::_entities::assessments::Model;

/// A single row in the DVLA M1 dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentRow {
    pub id: String,
    pub signatory_name: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub gp_name: String,
    pub consultant_name: String,
    pub has_mental_health_diagnosis: String,
    pub condition_count: u32,
    pub complete: bool,
    pub stopped_at_q1: bool,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
    pub signature_date: String,
}

impl AssessmentRow {
    /// Build a row from an assessment model that has a completed validation result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: ValidationResult = m
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

        Some(Self {
            id: m.id.to_string(),
            signatory_name: data.authorisation.signatory_name,
            full_name: data.personal_details.full_name,
            date_of_birth: data.personal_details.date_of_birth,
            gp_name: data.healthcare_professionals.gp.gp_name,
            consultant_name: data
                .healthcare_professionals
                .consultant
                .consultant_name,
            has_mental_health_diagnosis: data
                .diagnosis_confirmation
                .has_mental_health_diagnosis,
            condition_count: result.condition_count,
            complete: result.complete,
            stopped_at_q1: result.stopped_at_q1,
            urgent_flag_count,
            high_flag_count,
            signature_date: data.authorisation.signature_date,
        })
    }
}
