use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, FlagPriority};
use crate::models::_entities::assessments::Model;
use crate::views::assessment::PersistedResult;

/// A single row in the prehospital dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub run_date: String,
    pub patient_name: String,
    pub chief_complaint: String,
    pub triage_category: String,
    pub disposition: String,
    pub provider_name: String,
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: PersistedResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| f.priority == FlagPriority::Urgent)
            .count() as u32;
        let high_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| f.priority == FlagPriority::High)
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            run_date: data.caller_and_scene.date,
            patient_name: data.caller_and_scene.patient_name,
            chief_complaint: data.chief_complaint_and_vitals.chief_complaint,
            triage_category: data.triage.category,
            disposition: data.disposition.disposition,
            provider_name: data.disposition.provider_name,
            complete: result.validation.complete,
            total_required: result.validation.total_required,
            total_satisfied: result.validation.total_satisfied,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
