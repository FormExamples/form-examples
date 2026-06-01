use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the tissue-viability dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub clinician_name: String,
    pub follow_up_date: String,
    pub braden_score: i32,
    pub risk_level: String,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let mut urgent = 0u32;
        let mut high = 0u32;
        for f in &result.additional_flags {
            match f.priority.as_str() {
                "urgent" => urgent += 1,
                "high" => high += 1,
                _ => {}
            }
        }

        let patient_name = format!(
            "{} {}",
            data.demographics.first_name.trim(),
            data.demographics.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            patient_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            clinician_name: data.clinical_impression_care_plan.clinician_name,
            follow_up_date: data.clinical_impression_care_plan.follow_up_date,
            braden_score: result.braden_score,
            risk_level: result.risk_level,
            urgent_flag_count: urgent,
            high_flag_count: high,
        })
    }
}
