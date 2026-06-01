use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the renal-clinic dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub patient_first_name: String,
    pub patient_last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub gfr_category: String,
    pub albuminuria_category: String,
    pub risk_level: String,
    pub egfr: Option<f64>,
    pub acr: Option<f64>,
    pub suspected_etiology: String,
    pub nephrology_referral: String,
    pub urgent_flag_count: u32,
    pub high_priority_flag_count: u32,
    pub timestamp: String,
}

impl CaseRow {
    /// Build a CaseRow from a renal-assessment model with a completed grade.
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
        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            patient_first_name: data.demographics.first_name,
            patient_last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            gfr_category: result.gfr_category,
            albuminuria_category: result.albuminuria_category,
            risk_level: result.risk_level,
            egfr: result.egfr,
            acr: result.acr,
            suspected_etiology: data.clinical_impression.suspected_etiology,
            nephrology_referral: data.clinical_impression.nephrology_referral,
            urgent_flag_count,
            high_priority_flag_count,
            timestamp: result.timestamp,
        })
    }
}
