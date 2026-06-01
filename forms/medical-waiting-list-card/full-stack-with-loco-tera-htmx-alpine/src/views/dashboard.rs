use serde::{Deserialize, Serialize};

use crate::engine::types::{Card, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the waiting-list dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientRow {
    pub id: String,
    pub nhs_number: String,
    pub patient_name: String,
    pub specialty: String,
    pub procedure_description: String,
    pub clinical_priority: String,
    pub waiting_time_status: String,
    pub rtt_clock_start_date: String,
    pub days_waited: Option<i64>,
    pub appointment_date: String,
}

impl PatientRow {
    /// Build a `PatientRow` from a card that has a completed grading
    /// result. Returns `None` if the card is unreadable.
    pub fn from_model(m: &Model) -> Option<Self> {
        let card: Card = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        Some(Self {
            id: m.id.to_string(),
            nhs_number: card.patient.united_kingdom_nhs_number.clone(),
            patient_name: card.patient.name.clone(),
            specialty: card.waiting_list.specialty.clone(),
            procedure_description: card.waiting_list.procedure_description.clone(),
            clinical_priority: card.waiting_list.clinical_priority.clone(),
            waiting_time_status: result.waiting_time_status,
            rtt_clock_start_date: card.waiting_list.rtt_clock_start_date.clone(),
            days_waited: result.days_waited,
            appointment_date: card.appointment.appointment_date.clone(),
        })
    }
}
