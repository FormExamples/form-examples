use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the BLS training dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub session_date: String,
    pub trainee_first_name: String,
    pub trainee_last_name: String,
    pub trainee_id: String,
    pub trainee_role: String,
    pub examiner_name: String,
    pub outcome: String,
    pub critical_failure_count: u32,
    pub non_critical_deficiency_count: u32,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed result.
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
            session_date: data.trainee_details.session_date,
            trainee_first_name: data.trainee_details.first_name,
            trainee_last_name: data.trainee_details.last_name,
            trainee_id: data.trainee_details.trainee_id,
            trainee_role: data.trainee_details.role,
            examiner_name: data.trainee_details.examiner_name,
            outcome: result.outcome,
            critical_failure_count: result.critical_failures.len() as u32,
            non_critical_deficiency_count: result.non_critical_deficiencies.len() as u32,
            high_priority_flag_count,
        })
    }
}
