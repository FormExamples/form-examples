use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the emergency-unit dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub date_of_arrival: String,
    pub time_of_arrival: String,
    pub hospital_registration_number: String,
    pub patient_name: String,
    pub sex: String,
    pub chief_complaint: String,
    pub triage_category: String,
    pub arrival_mode: String,
    pub disposition: String,
    pub encounter_status: String,
    pub overall_percent: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
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
            .flagged_issues
            .iter()
            .filter(|f| matches!(f.priority, crate::engine::types::FlagPriority::Urgent))
            .count() as u32;
        let high_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| matches!(f.priority, crate::engine::types::FlagPriority::High))
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.patient_registration.first_name.trim(),
            data.patient_registration.surname.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            date_of_arrival: data.patient_registration.date_of_arrival,
            time_of_arrival: data.patient_registration.time_of_arrival,
            hospital_registration_number: data.patient_registration.hospital_registration_number,
            patient_name,
            sex: data.patient_registration.sex,
            chief_complaint: data.chief_complaint_and_vitals.chief_complaint,
            triage_category: data.chief_complaint_and_vitals.triage_category,
            arrival_mode: data.patient_registration.arrival_mode,
            disposition: data.disposition.disposition,
            encounter_status: result.encounter_status,
            overall_percent: result.overall_percent,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
