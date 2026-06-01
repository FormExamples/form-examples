use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the audiology / ENT dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub assessment_date: String,
    pub patient_name: String,
    pub patient_sex: String,
    pub patient_date_of_birth: String,
    pub provisional_diagnosis: String,
    pub hearing_loss_grade: String,
    pub better_ear_pta: Option<f64>,
    pub asymmetry: Option<f64>,
    pub dhi_total: u32,
    pub dhi_handicap_level: String,
    pub urgent_flag_count: u32,
    pub high_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from a model that has a completed grading result.
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

        let patient_name = format!(
            "{} {}",
            data.demographics.first_name.trim(),
            data.demographics.last_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            assessment_date: data.demographics.assessment_date,
            patient_name,
            patient_sex: data.demographics.sex,
            patient_date_of_birth: data.demographics.date_of_birth,
            provisional_diagnosis: data.clinical_impression_referral.provisional_diagnosis,
            hearing_loss_grade: result.hearing_loss_grade,
            better_ear_pta: result.better_ear_pta,
            asymmetry: result.asymmetry,
            dhi_total: result.dhi_total,
            dhi_handicap_level: result.dhi_handicap_level,
            urgent_flag_count,
            high_flag_count,
        })
    }
}
