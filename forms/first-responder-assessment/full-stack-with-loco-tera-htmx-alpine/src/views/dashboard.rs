use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the first responder dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponderRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub role_type: String,
    pub employer_organisation: String,
    pub assessment_date: String,
    pub overall_competency: String,
    pub overall_fitness: String,
    pub overall_risk: String,
    pub high_priority_flag_count: u32,
    pub fired_rule_count: u32,
}

impl ResponderRow {
    /// Build a ResponderRow from an assessment model that has a completed grading result.
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
        let fired_rule_count = result.fired_rules.len() as u32;

        Some(Self {
            id: m.id.to_string(),
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            role_type: data.role_qualifications.role_type,
            employer_organisation: data.role_qualifications.employer_organisation,
            assessment_date: data.fitness_decision.assessment_date,
            overall_competency: result.overall_competency,
            overall_fitness: result.overall_fitness,
            overall_risk: result.overall_risk,
            high_priority_flag_count,
            fired_rule_count,
        })
    }
}
