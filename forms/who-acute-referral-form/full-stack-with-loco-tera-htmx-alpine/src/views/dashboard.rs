use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, ReportResult};
use crate::models::_entities::assessments::Model;

/// A single row in the referral dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferralRow {
    pub id: String,
    pub patient_last_name: String,
    pub patient_first_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub initiating_facility_name: String,
    pub referral_facility_name: String,
    pub mode_of_transfer: String,
    pub transfer_decision_date_time: String,
    pub departure_date_time: String,
    pub chief_complaint: String,
    pub primary_diagnosis: String,
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl ReferralRow {
    /// Build a ReferralRow from a referral model that has a completed report.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: ReportResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

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
            patient_last_name: data.patient_identification.patient_last_name,
            patient_first_name: data.patient_identification.patient_first_name,
            date_of_birth: data.patient_identification.date_of_birth,
            sex: data.patient_identification.sex,
            initiating_facility_name: data.facility_and_transport.initiating_facility.name,
            referral_facility_name: data.facility_and_transport.referral_facility.name,
            mode_of_transfer: data.facility_and_transport.mode_of_transfer,
            transfer_decision_date_time: data.facility_and_transport.transfer_decision_date_time,
            departure_date_time: data.facility_and_transport.departure_date_time,
            chief_complaint: data.situation.chief_complaint,
            primary_diagnosis: data.situation.primary_diagnosis,
            complete: result.validation.complete,
            total_required: result.validation.total_required,
            total_satisfied: result.validation.total_satisfied,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
