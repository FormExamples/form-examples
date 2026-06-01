use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the operating-team dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub case_date: String,
    pub site_name: String,
    pub operating_room: String,
    pub patient_name: String,
    pub patient_nhs_number: String,
    pub planned_procedure: String,
    pub surgical_specialty: String,
    pub urgency: String,
    pub surgeon_name: String,
    pub anaesthetist_name: String,
    pub lead_nurse_name: String,
    pub checklist_status: String,
    pub overall_percent: u32,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from a checklist model that has a completed grading result.
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

        Some(Self {
            id: m.id.to_string(),
            case_date: data.case_details.case_date,
            site_name: data.case_details.site_name,
            operating_room: data.case_details.operating_room,
            patient_name: data.case_details.patient_name,
            patient_nhs_number: data.case_details.patient_nhs_number,
            planned_procedure: data.case_details.planned_procedure,
            surgical_specialty: data.case_details.surgical_specialty,
            urgency: data.case_details.urgency,
            surgeon_name: data.case_details.surgeon_name,
            anaesthetist_name: data.case_details.anaesthetist_name,
            lead_nurse_name: data.case_details.lead_nurse_name,
            checklist_status: result.checklist_status,
            overall_percent: result.overall_percent,
            high_priority_flag_count,
        })
    }
}
