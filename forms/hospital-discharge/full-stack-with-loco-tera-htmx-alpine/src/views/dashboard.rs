use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the hospital-discharge dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DischargeRow {
    pub id: String,
    pub discharge_date: String,
    pub admission_date: String,
    pub patient_name: String,
    pub nhs_number: String,
    pub ward: String,
    pub consultant: String,
    pub specialty: String,
    pub discharge_destination: String,
    pub completeness_level: String,
    pub mandatory_satisfied: u32,
    pub mandatory_total: u32,
    pub urgent_flag_count: u32,
}

impl DischargeRow {
    /// Build a DischargeRow from a model that has a completed grading result.
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

        let patient_name = format!(
            "{} {}",
            data.patient_details.first_name, data.patient_details.last_name
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            discharge_date: data.admission_summary.discharge_date,
            admission_date: data.admission_summary.admission_date,
            patient_name,
            nhs_number: data.patient_details.nhs_number,
            ward: data.admission_summary.ward,
            consultant: data.admission_summary.consultant,
            specialty: data.admission_summary.specialty,
            discharge_destination: data.community_care_instructions.discharge_destination,
            completeness_level: result.completeness_level,
            mandatory_satisfied: result.mandatory_satisfied,
            mandatory_total: result.mandatory_total,
            urgent_flag_count,
        })
    }
}
