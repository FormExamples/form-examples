use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, Grade};
use crate::models::_entities::assessments::Model;

/// A single row in the fit-note dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FitNoteRow {
    pub id: String,
    pub assessment_date: String,
    pub patient_name: String,
    pub patient_nhs_number: String,
    pub clinician_name: String,
    pub clinician_profession: String,
    pub diagnosis_text: String,
    pub diagnosis_category: String,
    pub fitness_category: String,
    pub adaptation_intensity: String,
    pub period_compliance: String,
    pub period_days: Option<i64>,
    pub recommendation: String,
    pub is_valid: String,
    pub high_priority_flag_count: u32,
}

impl FitNoteRow {
    /// Build a FitNoteRow from a model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: Grade = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let high_priority_flag_count = result
            .safety_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            assessment_date: data.assessment_date,
            patient_name: data.patient.name,
            patient_nhs_number: data.patient.united_kingdom_nhs_number,
            clinician_name: data.clinician.name,
            clinician_profession: data.clinician.profession,
            diagnosis_text: data.diagnosis_text,
            diagnosis_category: data.diagnosis_category,
            fitness_category: result.fitness_category,
            adaptation_intensity: result.adaptation_intensity,
            period_compliance: result.period_compliance,
            period_days: result.period_days,
            recommendation: result.recommendation,
            is_valid: result.is_valid,
            high_priority_flag_count,
        })
    }
}
