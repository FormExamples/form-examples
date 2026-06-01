use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the medical-error-report dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportRow {
    pub id: String,
    pub report_date: String,
    pub incident_date: String,
    pub facility_name: String,
    pub facility_ward: String,
    pub location_type: String,
    pub error_type: String,
    pub who_severity: String,
    pub ncc_merp_category: String,
    pub overall_risk: String,
    pub reporter_role: String,
    pub anonymous_report: String,
    pub final_status: String,
    pub high_priority_flag_count: u32,
}

impl ReportRow {
    /// Build a ReportRow from a report model that has a completed grading result.
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
            report_date: data.demographics.report_date,
            incident_date: data.incident_details.incident_date,
            facility_name: data.demographics.facility_name,
            facility_ward: data.demographics.facility_ward,
            location_type: data.incident_details.location_type,
            error_type: data.error_classification.error_type,
            who_severity: result.who_severity,
            ncc_merp_category: result.ncc_merp_category,
            overall_risk: result.overall_risk,
            reporter_role: data.demographics.reporter_role,
            anonymous_report: data.demographics.anonymous_report,
            final_status: data.reporting_followup.final_status,
            high_priority_flag_count,
        })
    }
}
