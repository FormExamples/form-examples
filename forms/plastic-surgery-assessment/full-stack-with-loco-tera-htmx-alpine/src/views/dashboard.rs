use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the plastic-surgery dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub urgency: String,
    pub referral_type: String,
    pub proposed_procedure: String,
    pub asa_class: String,
    pub wound_class: String,
    pub complexity_score: String,
    pub overall_risk: String,
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

        let patient_name = format!(
            "{} {}",
            data.demographics.first_name, data.demographics.last_name
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            patient_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            urgency: data.reason_for_referral.urgency,
            referral_type: data.reason_for_referral.referral_type,
            proposed_procedure: data.procedure_planning_consent.proposed_procedure,
            asa_class: result
                .asa_class
                .map(|v| v.to_string())
                .unwrap_or_default(),
            wound_class: result
                .wound_class
                .map(|v| v.to_string())
                .unwrap_or_default(),
            complexity_score: result
                .complexity_score
                .map(|v| v.to_string())
                .unwrap_or_default(),
            overall_risk: result.overall_risk,
            high_priority_flag_count,
        })
    }
}
