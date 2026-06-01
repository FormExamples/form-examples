use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the clinician dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub preferred_method: String,
    pub overall_risk: String,
    pub coc_mec: u8,
    pub pop_mec: u8,
    pub implant_mec: u8,
    pub injection_mec: u8,
    pub iud_mec: u8,
    pub ius_mec: u8,
    pub high_priority_flag_count: u32,
    pub fired_rule_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an assessment model that has a completed grading result.
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
            first_name: data.demographics.first_name,
            last_name: data.demographics.last_name,
            date_of_birth: data.demographics.date_of_birth,
            sex: data.demographics.sex,
            preferred_method: data.contraceptive_preferences.preferred_method,
            overall_risk: result.overall_risk,
            coc_mec: result.method_mec.coc,
            pop_mec: result.method_mec.pop,
            implant_mec: result.method_mec.implant,
            injection_mec: result.method_mec.injection,
            iud_mec: result.method_mec.iud,
            ius_mec: result.method_mec.ius,
            high_priority_flag_count,
            fired_rule_count: result.fired_rules.len() as u32,
        })
    }
}
