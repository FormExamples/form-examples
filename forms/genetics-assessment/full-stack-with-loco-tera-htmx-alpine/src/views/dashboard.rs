use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the genetics clinic dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub proband_first_name: String,
    pub proband_last_name: String,
    pub proband_mrn: String,
    pub date_of_birth: String,
    pub chief_concern: String,
    pub referral_urgency: String,
    pub suspected_syndrome: String,
    pub risk_level: String,
    pub manchester_score: i32,
    pub bethesda_met: i32,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from a model that has a completed grading result.
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
            proband_first_name: data.proband_demographics.first_name,
            proband_last_name: data.proband_demographics.last_name,
            proband_mrn: data.proband_demographics.mrn,
            date_of_birth: data.proband_demographics.date_of_birth,
            chief_concern: data.presenting_concern.chief_concern,
            referral_urgency: data.presenting_concern.urgency,
            suspected_syndrome: data.presenting_concern.suspected_syndrome,
            risk_level: result.risk_level,
            manchester_score: result.manchester_score,
            bethesda_met: result.bethesda_met,
            high_priority_flag_count,
        })
    }
}
