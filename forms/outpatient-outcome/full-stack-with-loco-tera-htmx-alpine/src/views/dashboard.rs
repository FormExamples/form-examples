use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the outpatient-outcome dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub clinic_date: String,
    pub specialty: String,
    pub clinician_name: String,
    pub patient_name: String,
    pub patient_nhs_number: String,
    pub modality: String,
    pub appointment_type: String,
    pub nhs_attendance_outcome: String,
    pub overall_grade: String,
    pub clinical_grade: String,
    pub prom_grade: String,
    pub prem_grade: String,
    pub operational_grade: String,
    pub critical_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from a completed assessment model.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let critical_flag_count = result
            .flagged_issues
            .iter()
            .filter(|f| f.priority == "critical" || f.priority == "high")
            .count() as u32;

        let patient_name = format!(
            "{} {}",
            data.patient_details.given_name.trim(),
            data.patient_details.family_name.trim()
        )
        .trim()
        .to_string();

        Some(Self {
            id: m.id.to_string(),
            clinic_date: data.encounter_details.clinic_date,
            specialty: data.encounter_details.specialty,
            clinician_name: data.encounter_details.clinician_name,
            patient_name,
            patient_nhs_number: data.patient_details.nhs_number,
            modality: data.encounter_details.modality,
            appointment_type: data.encounter_details.appointment_type,
            nhs_attendance_outcome: data.operational_efficiency.nhs_attendance_outcome,
            overall_grade: result.overall_grade,
            clinical_grade: result.clinical_grade,
            prom_grade: result.prom_grade,
            prem_grade: result.prem_grade,
            operational_grade: result.operational_grade,
            critical_flag_count,
        })
    }
}
