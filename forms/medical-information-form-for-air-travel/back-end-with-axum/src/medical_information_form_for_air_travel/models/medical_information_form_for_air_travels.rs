//! medical_information_form_for_air_travels model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub status: String,
    pub submitter_name: String,
    pub submitter_role: String,
    pub submitter_email: String,
    pub submitter_phone: String,
    pub submitter_organisation: String,
    pub airline_booking_reference: String,
    pub airline_iata_code: String,
    pub airline_name: String,
    pub outbound_flight_number: String,
    pub outbound_date: Option<Date>,
    pub outbound_origin_iata: String,
    pub outbound_destination_iata: String,
    pub return_flight_number: String,
    pub return_date: Option<Date>,
    pub cabin_class: String,
    pub sector_duration_minutes: Option<i32>,
    pub transit_airports_iata: String,
    pub special_assistance_codes: String,
    pub reason_equipment: String,
    pub reason_recent_acute_event: String,
    pub reason_unstable_condition: String,
    pub reason_communicable_disease: String,
    pub reason_pregnancy: String,
    pub reason_mobility_escort: String,
    pub reason_psychiatric: String,
    pub primary_diagnosis: String,
    pub icd10_codes: String,
    pub diagnosis_date: Option<Date>,
    pub current_treatment: String,
    pub last_admission_date: Option<Date>,
    pub last_discharge_date: Option<Date>,
    pub last_specialist_review_date: Option<Date>,
    pub resting_systolic_bp: Option<i32>,
    pub resting_diastolic_bp: Option<i32>,
    pub resting_heart_rate: Option<i32>,
    pub nyha_class: String,
    pub recent_mi_date: Option<Date>,
    pub recent_stent_date: Option<Date>,
    pub on_anticoagulant: String,
    pub pacemaker_or_icd: String,
    pub exercise_tolerance_metres: Option<i32>,
    pub unstable_angina: String,
    pub resting_spo2_percent: Option<f64>,
    pub predicted_inflight_spo2_percent: Option<f64>,
    pub hypoxic_challenge_result: String,
    pub recent_pneumothorax_date: Option<Date>,
    pub asthma_severity: String,
    pub copd_severity: String,
    pub cpap_or_bipap_use: String,
    pub recent_pulmonary_embolism_date: Option<Date>,
    pub last_surgery_date: Option<Date>,
    pub last_surgery_site: String,
    pub cabin_gas_risk: String,
    pub recent_fracture_cast: String,
    pub recent_dvt_date: Option<Date>,
    pub scuba_diving_within_24h: String,
    pub recent_stroke_date: Option<Date>,
    pub is_pregnant: String,
    pub gestation_weeks: Option<i32>,
    pub pregnancy_type: String,
    pub pregnancy_complications: String,
    pub expected_delivery_date: Option<Date>,
    pub obstetrician_contact: String,
    pub communicable_disease_status: String,
    pub last_symptom_date: Option<Date>,
    pub isolation_required: String,
    pub vaccination_status: String,
    pub current_antimicrobials: String,
    pub requires_supplemental_oxygen: String,
    pub oxygen_flow_rate_lpm: Option<f64>,
    pub oxygen_duration: String,
    pub requires_poc: String,
    pub poc_make_model: String,
    pub poc_battery_hours: Option<f64>,
    pub requires_stretcher: String,
    pub requires_incubator: String,
    pub requires_iv_pump: String,
    pub requires_medical_escort: String,
    pub requires_extra_seat: String,
    pub requires_accessible_lavatory: String,
    pub wheelchair_type: String,
    pub accompanying_carer: String,
    pub regular_medications: String,
    pub controlled_drugs: String,
    pub dangerous_goods_battery_declaration: String,
    pub sharps_in_cabin: String,
    pub refrigerated_medication: String,
    pub customs_documentation_available: String,
    pub haemoglobin_g_per_l: Option<i32>,
    pub physician_declaration: String,
    pub physician_signature_name: String,
    pub physician_signature_date: Option<Date>,
    pub valid_until_date: Option<Date>,
    pub additional_notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM medical_information_form_for_air_travels WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM medical_information_form_for_air_travels WHERE \
            deleted_at IS NULL",
        )
        .fetch_one(db)
        .await?;
        Ok((rows, total))
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as(
            "SELECT * FROM medical_information_form_for_air_travels WHERE id = $1 AND \
            deleted_at IS NULL",
        )
        .bind(id)
        .fetch_optional(db)
        .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query(
            "WITH target AS (UPDATE medical_information_form_for_air_travels SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            medical_information_form_for_air_travel_grades SET deleted_at = now(), \
            updated_at = now() WHERE medical_information_form_for_air_travel_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE medical_information_form_for_air_travel_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE \
            medical_information_form_for_air_travel_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            medical_information_form_for_air_travel_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE medical_information_form_for_air_travel_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
