use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the prescription-request dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub request_date: String,
    pub patient_first_name: String,
    pub patient_last_name: String,
    pub patient_nhs_number: String,
    pub clinician_first_name: String,
    pub clinician_last_name: String,
    pub medication_name: String,
    pub dosage: String,
    pub priority_level: String,
    pub fired_rule_count: u32,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grade.
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

        let fired_rule_count = result.fired_rules.len() as u32;

        Some(Self {
            id: m.id.to_string(),
            request_date: data.prescription_details.request_date,
            patient_first_name: data.patient_information.first_name,
            patient_last_name: data.patient_information.last_name,
            patient_nhs_number: data.patient_information.nhs_number,
            clinician_first_name: data.clinician_information.first_name,
            clinician_last_name: data.clinician_information.last_name,
            medication_name: data.prescription_details.medication_name,
            dosage: data.prescription_details.dosage,
            priority_level: result.priority_level,
            fired_rule_count,
            high_priority_flag_count,
        })
    }
}
