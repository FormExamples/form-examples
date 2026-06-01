use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the patient-satisfaction dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub visit_date: String,
    pub hospital_site: String,
    pub department: String,
    pub visit_type: String,
    pub patient_name: String,
    pub referral_source: String,
    pub satisfaction_category: String,
    pub normalized_score: f64,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from a survey model that has a completed grading result.
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

        let patient_name = {
            let first = data.demographics.first_name.trim();
            let last = data.demographics.last_name.trim();
            if first.is_empty() && last.is_empty() {
                String::new()
            } else {
                format!("{first} {last}").trim().to_string()
            }
        };

        Some(Self {
            id: m.id.to_string(),
            visit_date: data.visit_details.visit_date,
            hospital_site: data.visit_details.hospital_site,
            department: data.visit_details.department,
            visit_type: data.visit_details.visit_type,
            patient_name,
            referral_source: data.visit_details.referral_source,
            satisfaction_category: result.satisfaction_category,
            normalized_score: result.normalized_score,
            high_priority_flag_count,
        })
    }
}
