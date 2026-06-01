use serde::{Deserialize, Serialize};

use crate::engine::types::{ApplicationData, GradeResult};
use crate::models::_entities::assessments::Model;

/// A single row in the practitioner dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplicationRow {
    pub id: String,
    pub patient_name: String,
    pub patient_nhs_number: String,
    pub patient_birth_date: String,
    pub practitioner_name: String,
    pub practice_name: String,
    pub outcome: String,
    pub redirect_to: String,
    pub eligible_condition_codes: Vec<String>,
    pub valid_from: String,
    pub valid_until: String,
    pub high_priority_flag_count: u32,
}

impl ApplicationRow {
    /// Build an ApplicationRow from a model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: ApplicationData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradeResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| {
                matches!(
                    f.priority,
                    crate::engine::types::RulePriority::High
                        | crate::engine::types::RulePriority::Urgent
                )
            })
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.patient.forenames.trim(),
            data.patient.surname.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            patient_name,
            patient_nhs_number: data.patient.united_kingdom_nhs_number,
            patient_birth_date: data.patient.birth_date,
            practitioner_name: data.practitioner.name,
            practice_name: data.practitioner.practice_name,
            outcome: result.outcome,
            redirect_to: result.redirect_to,
            eligible_condition_codes: result.eligible_condition_codes,
            valid_from: result.valid_from,
            valid_until: result.valid_until,
            high_priority_flag_count,
        })
    }
}
