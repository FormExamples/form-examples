use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the counter-referral dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub date_of_birth: String,
    pub referral_facility: String,
    pub primary_care_facility: String,
    pub primary_diagnosis: String,
    pub follow_up_timeframe: String,
    pub form_status: String,
    pub overall_percent: u32,
    pub urgent_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading
    /// result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| {
                matches!(
                    f.priority,
                    crate::engine::types::FlagPriority::Urgent
                        | crate::engine::types::FlagPriority::High
                )
            })
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            patient_name: data.patient_identification.patient_name,
            date_of_birth: data.patient_identification.date_of_birth,
            referral_facility: data.facility_details.referral_facility.name,
            primary_care_facility: data.facility_details.primary_care_facility.name,
            primary_diagnosis: data.situation.primary_diagnosis,
            follow_up_timeframe: data.facility_details.follow_up_timeframe,
            form_status: result.form_status,
            overall_percent: result.overall_percent,
            urgent_flag_count,
        })
    }
}
