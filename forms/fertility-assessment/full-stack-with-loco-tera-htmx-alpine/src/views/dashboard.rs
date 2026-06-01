use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::engine::utils::age_in_years;
use crate::models::_entities::assessments::Model;

/// A single row in the fertility-clinic dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_name: String,
    pub patient_age: Option<i32>,
    pub partner_name: String,
    pub assessment_date: String,
    pub clinician_name: String,
    pub recommendation: String,
    pub referral_urgency: String,
    pub concern_level: String,
    pub concern_score: i32,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment with a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let patient_name = format!(
            "{} {}",
            data.demographics.patient_first_name.trim(),
            data.demographics.patient_last_name.trim()
        )
        .trim()
        .to_string();
        let partner_name = format!(
            "{} {}",
            data.demographics.partner_first_name.trim(),
            data.demographics.partner_last_name.trim()
        )
        .trim()
        .to_string();

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
            patient_name,
            patient_age: age_in_years(&data.demographics.patient_date_of_birth),
            partner_name,
            assessment_date: data.clinical_recommendation.assessment_date,
            clinician_name: data.clinical_recommendation.clinician_name,
            recommendation: data.clinical_recommendation.recommendation,
            referral_urgency: data.clinical_recommendation.referral_urgency,
            concern_level: result.concern_level,
            concern_score: result.concern_score,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
