use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the obstetrics-team dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub booking_date: String,
    pub estimated_due_date: String,
    pub gestation_weeks: Option<i32>,
    pub bmi: Option<f64>,
    pub recommended_care_pathway: String,
    pub risk_level: String,
    pub answered_count: u32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model with a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let urgent_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "urgent")
            .count() as u32;
        let high_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            first_name: data.maternal_demographics.first_name,
            last_name: data.maternal_demographics.last_name,
            date_of_birth: data.maternal_demographics.date_of_birth,
            booking_date: data.current_pregnancy.booking_date,
            estimated_due_date: data.current_pregnancy.estimated_due_date,
            gestation_weeks: data.current_pregnancy.gestation_weeks,
            bmi: data.maternal_demographics.bmi,
            recommended_care_pathway: data.care_plan_followup.recommended_care_pathway,
            risk_level: result.risk_level,
            answered_count: result.answered_count,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
