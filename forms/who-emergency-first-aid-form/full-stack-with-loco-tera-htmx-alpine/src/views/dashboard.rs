use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the CFAR encounter dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub event_date_time: String,
    pub patient_name: String,
    pub patient_sex: String,
    pub referral_facility: String,
    pub problem_type: String,
    pub pregnant: String,
    pub responder_name: String,
    pub cfar_organization: String,
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
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

        let problem_type = match (data.situation.medical, data.situation.trauma) {
            (true, true) => "medical+trauma".to_string(),
            (true, false) => "medical".to_string(),
            (false, true) => "trauma".to_string(),
            (false, false) => "".to_string(),
        };

        let urgent_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| f.priority == crate::engine::types::FlagPriority::Urgent)
            .count() as u32;
        let high_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| f.priority == crate::engine::types::FlagPriority::High)
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            event_date_time: data.referral_transport.event_date_time,
            patient_name: data.patient_identification.patient_name,
            patient_sex: data.patient_identification.sex,
            referral_facility: data.referral_transport.referral_facility.name,
            problem_type,
            pregnant: data.situation.pregnant,
            responder_name: data.responder_details.name,
            cfar_organization: data.responder_details.cfar_organization,
            complete: result.validation.complete,
            total_required: result.validation.total_required,
            total_satisfied: result.validation.total_satisfied,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
