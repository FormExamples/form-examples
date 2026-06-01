use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, ValidationResult};
use crate::models::_entities::assessments::Model;

/// A single row in the MAT B1 administrative dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentRow {
    pub id: String,
    pub patient_name: String,
    pub certificate_type: String,
    pub issuer_type: String,
    pub issuer_name: String,
    pub certificate_number: String,
    pub issue_date: String,
    pub complete: bool,
    pub fired_rule_count: u32,
    pub urgent_or_high_flag_count: u32,
}

impl AssessmentRow {
    /// Build a row from a model that has a completed validation result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: ValidationResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let issuer_name = match data.issuer.issuer_type.as_str() {
            "doctor" => data.issuer.doctor.doctor_name.clone(),
            "midwife" => data.issuer.midwife.midwife_name.clone(),
            _ => String::new(),
        };

        let urgent_or_high_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| {
                matches!(
                    f.priority,
                    crate::engine::types::RulePriority::Urgent
                        | crate::engine::types::RulePriority::High
                )
            })
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            patient_name: data.patient_identification.patient_name,
            certificate_type: result.certificate_type,
            issuer_type: result.issuer_type,
            issuer_name,
            certificate_number: data.issuer.certificate_number,
            issue_date: data.issuer.issue_date,
            complete: result.complete,
            fired_rule_count: result.fired_rules.len() as u32,
            urgent_or_high_flag_count,
        })
    }
}
