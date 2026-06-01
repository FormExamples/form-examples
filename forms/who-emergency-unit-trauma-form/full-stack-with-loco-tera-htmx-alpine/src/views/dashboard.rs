use serde::{Deserialize, Serialize};

use crate::engine::types::AssessmentData;
use crate::models::_entities::assessments::Model;
use crate::views::assessment::ReportResult;

/// A single row in the trauma dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub date_of_arrival: String,
    pub time_of_arrival: String,
    pub patient_name: String,
    pub patient_sex: String,
    pub triage_category: String,
    pub chief_complaint: String,
    pub disposition: String,
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub urgent_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed report.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: ReportResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| {
                use crate::engine::types::FlagPriority;
                matches!(f.priority, FlagPriority::Urgent)
            })
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.patient_registration.first_name,
            data.patient_registration.surname
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            date_of_arrival: data.patient_registration.date_of_arrival,
            time_of_arrival: data.patient_registration.time_of_arrival,
            patient_name,
            patient_sex: data.patient_registration.sex,
            triage_category: data.triage.category,
            chief_complaint: data.chief_complaint_and_vitals.chief_complaint,
            disposition: data.disposition.disposition,
            complete: result.validation.complete,
            total_required: result.validation.total_required,
            total_satisfied: result.validation.total_satisfied,
            urgent_flag_count,
        })
    }
}
