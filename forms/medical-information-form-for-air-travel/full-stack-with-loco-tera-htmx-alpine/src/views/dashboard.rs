use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the airline-medical-desk dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub outbound_date: String,
    pub airline_iata_code: String,
    pub airline_name: String,
    pub outbound_flight_number: String,
    pub outbound_origin_iata: String,
    pub outbound_destination_iata: String,
    pub passenger_name: String,
    pub passenger_date_of_birth: String,
    pub primary_diagnosis: String,
    pub physician_name: String,
    pub fitness_band: String,
    pub fired_rule_count: u32,
    pub high_priority_flag_count: u32,
    pub valid_until: String,
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
            .safety_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;
        let fired_rule_count = result.fired_rules.len() as u32;

        Some(Self {
            id: m.id.to_string(),
            outbound_date: data.trip.outbound_date,
            airline_iata_code: data.trip.airline_iata_code,
            airline_name: data.trip.airline_name,
            outbound_flight_number: data.trip.outbound_flight_number,
            outbound_origin_iata: data.trip.outbound_origin_iata,
            outbound_destination_iata: data.trip.outbound_destination_iata,
            passenger_name: data.passenger.passenger_name,
            passenger_date_of_birth: data.passenger.passenger_date_of_birth,
            primary_diagnosis: data.diagnosis.primary_diagnosis,
            physician_name: data.physician.physician_name,
            fitness_band: result.fitness_band,
            fired_rule_count,
            high_priority_flag_count,
            valid_until: result.valid_until,
        })
    }
}
