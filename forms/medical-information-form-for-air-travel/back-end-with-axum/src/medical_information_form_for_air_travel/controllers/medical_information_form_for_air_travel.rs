#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_information_form_for_air_travels::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
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
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_information_form_for_air_travels (deleted_at, patient_id, \
            clinician_id, status, submitter_name, submitter_role, submitter_email, \
            submitter_phone, submitter_organisation, airline_booking_reference, \
            airline_iata_code, airline_name, outbound_flight_number, outbound_date, \
            outbound_origin_iata, outbound_destination_iata, return_flight_number, \
            return_date, cabin_class, sector_duration_minutes, transit_airports_iata, \
            special_assistance_codes, reason_equipment, reason_recent_acute_event, \
            reason_unstable_condition, reason_communicable_disease, reason_pregnancy, \
            reason_mobility_escort, reason_psychiatric, primary_diagnosis, icd10_codes, \
            diagnosis_date, current_treatment, last_admission_date, last_discharge_date, \
            last_specialist_review_date, resting_systolic_bp, resting_diastolic_bp, \
            resting_heart_rate, nyha_class, recent_mi_date, recent_stent_date, \
            on_anticoagulant, pacemaker_or_icd, exercise_tolerance_metres, unstable_angina, \
            resting_spo2_percent, predicted_inflight_spo2_percent, hypoxic_challenge_result, \
            recent_pneumothorax_date, asthma_severity, copd_severity, cpap_or_bipap_use, \
            recent_pulmonary_embolism_date, last_surgery_date, last_surgery_site, \
            cabin_gas_risk, recent_fracture_cast, recent_dvt_date, scuba_diving_within_24h, \
            recent_stroke_date, is_pregnant, gestation_weeks, pregnancy_type, \
            pregnancy_complications, expected_delivery_date, obstetrician_contact, \
            communicable_disease_status, last_symptom_date, isolation_required, \
            vaccination_status, current_antimicrobials, requires_supplemental_oxygen, \
            oxygen_flow_rate_lpm, oxygen_duration, requires_poc, poc_make_model, \
            poc_battery_hours, requires_stretcher, requires_incubator, requires_iv_pump, \
            requires_medical_escort, requires_extra_seat, requires_accessible_lavatory, \
            wheelchair_type, accompanying_carer, regular_medications, controlled_drugs, \
            dangerous_goods_battery_declaration, sharps_in_cabin, refrigerated_medication, \
            customs_documentation_available, haemoglobin_g_per_l, physician_declaration, \
            physician_signature_name, physician_signature_date, valid_until_date, \
            additional_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, \
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, \
            $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, \
            $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, \
            $94, $95, $96, $97, $98) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.submitter_name)
        .bind(&self.submitter_role)
        .bind(&self.submitter_email)
        .bind(&self.submitter_phone)
        .bind(&self.submitter_organisation)
        .bind(&self.airline_booking_reference)
        .bind(&self.airline_iata_code)
        .bind(&self.airline_name)
        .bind(&self.outbound_flight_number)
        .bind(self.outbound_date)
        .bind(&self.outbound_origin_iata)
        .bind(&self.outbound_destination_iata)
        .bind(&self.return_flight_number)
        .bind(self.return_date)
        .bind(&self.cabin_class)
        .bind(self.sector_duration_minutes)
        .bind(&self.transit_airports_iata)
        .bind(&self.special_assistance_codes)
        .bind(&self.reason_equipment)
        .bind(&self.reason_recent_acute_event)
        .bind(&self.reason_unstable_condition)
        .bind(&self.reason_communicable_disease)
        .bind(&self.reason_pregnancy)
        .bind(&self.reason_mobility_escort)
        .bind(&self.reason_psychiatric)
        .bind(&self.primary_diagnosis)
        .bind(&self.icd10_codes)
        .bind(self.diagnosis_date)
        .bind(&self.current_treatment)
        .bind(self.last_admission_date)
        .bind(self.last_discharge_date)
        .bind(self.last_specialist_review_date)
        .bind(self.resting_systolic_bp)
        .bind(self.resting_diastolic_bp)
        .bind(self.resting_heart_rate)
        .bind(&self.nyha_class)
        .bind(self.recent_mi_date)
        .bind(self.recent_stent_date)
        .bind(&self.on_anticoagulant)
        .bind(&self.pacemaker_or_icd)
        .bind(self.exercise_tolerance_metres)
        .bind(&self.unstable_angina)
        .bind(self.resting_spo2_percent)
        .bind(self.predicted_inflight_spo2_percent)
        .bind(&self.hypoxic_challenge_result)
        .bind(self.recent_pneumothorax_date)
        .bind(&self.asthma_severity)
        .bind(&self.copd_severity)
        .bind(&self.cpap_or_bipap_use)
        .bind(self.recent_pulmonary_embolism_date)
        .bind(self.last_surgery_date)
        .bind(&self.last_surgery_site)
        .bind(&self.cabin_gas_risk)
        .bind(&self.recent_fracture_cast)
        .bind(self.recent_dvt_date)
        .bind(&self.scuba_diving_within_24h)
        .bind(self.recent_stroke_date)
        .bind(&self.is_pregnant)
        .bind(self.gestation_weeks)
        .bind(&self.pregnancy_type)
        .bind(&self.pregnancy_complications)
        .bind(self.expected_delivery_date)
        .bind(&self.obstetrician_contact)
        .bind(&self.communicable_disease_status)
        .bind(self.last_symptom_date)
        .bind(&self.isolation_required)
        .bind(&self.vaccination_status)
        .bind(&self.current_antimicrobials)
        .bind(&self.requires_supplemental_oxygen)
        .bind(self.oxygen_flow_rate_lpm)
        .bind(&self.oxygen_duration)
        .bind(&self.requires_poc)
        .bind(&self.poc_make_model)
        .bind(self.poc_battery_hours)
        .bind(&self.requires_stretcher)
        .bind(&self.requires_incubator)
        .bind(&self.requires_iv_pump)
        .bind(&self.requires_medical_escort)
        .bind(&self.requires_extra_seat)
        .bind(&self.requires_accessible_lavatory)
        .bind(&self.wheelchair_type)
        .bind(&self.accompanying_carer)
        .bind(&self.regular_medications)
        .bind(&self.controlled_drugs)
        .bind(&self.dangerous_goods_battery_declaration)
        .bind(&self.sharps_in_cabin)
        .bind(&self.refrigerated_medication)
        .bind(&self.customs_documentation_available)
        .bind(self.haemoglobin_g_per_l)
        .bind(&self.physician_declaration)
        .bind(&self.physician_signature_name)
        .bind(self.physician_signature_date)
        .bind(self.valid_until_date)
        .bind(&self.additional_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_information_form_for_air_travels SET deleted_at = $2, patient_id = \
            $3, clinician_id = $4, status = $5, submitter_name = $6, submitter_role = $7, \
            submitter_email = $8, submitter_phone = $9, submitter_organisation = $10, \
            airline_booking_reference = $11, airline_iata_code = $12, airline_name = $13, \
            outbound_flight_number = $14, outbound_date = $15, outbound_origin_iata = $16, \
            outbound_destination_iata = $17, return_flight_number = $18, return_date = $19, \
            cabin_class = $20, sector_duration_minutes = $21, transit_airports_iata = $22, \
            special_assistance_codes = $23, reason_equipment = $24, reason_recent_acute_event \
            = $25, reason_unstable_condition = $26, reason_communicable_disease = $27, \
            reason_pregnancy = $28, reason_mobility_escort = $29, reason_psychiatric = $30, \
            primary_diagnosis = $31, icd10_codes = $32, diagnosis_date = $33, \
            current_treatment = $34, last_admission_date = $35, last_discharge_date = $36, \
            last_specialist_review_date = $37, resting_systolic_bp = $38, \
            resting_diastolic_bp = $39, resting_heart_rate = $40, nyha_class = $41, \
            recent_mi_date = $42, recent_stent_date = $43, on_anticoagulant = $44, \
            pacemaker_or_icd = $45, exercise_tolerance_metres = $46, unstable_angina = $47, \
            resting_spo2_percent = $48, predicted_inflight_spo2_percent = $49, \
            hypoxic_challenge_result = $50, recent_pneumothorax_date = $51, asthma_severity = \
            $52, copd_severity = $53, cpap_or_bipap_use = $54, recent_pulmonary_embolism_date \
            = $55, last_surgery_date = $56, last_surgery_site = $57, cabin_gas_risk = $58, \
            recent_fracture_cast = $59, recent_dvt_date = $60, scuba_diving_within_24h = $61, \
            recent_stroke_date = $62, is_pregnant = $63, gestation_weeks = $64, \
            pregnancy_type = $65, pregnancy_complications = $66, expected_delivery_date = \
            $67, obstetrician_contact = $68, communicable_disease_status = $69, \
            last_symptom_date = $70, isolation_required = $71, vaccination_status = $72, \
            current_antimicrobials = $73, requires_supplemental_oxygen = $74, \
            oxygen_flow_rate_lpm = $75, oxygen_duration = $76, requires_poc = $77, \
            poc_make_model = $78, poc_battery_hours = $79, requires_stretcher = $80, \
            requires_incubator = $81, requires_iv_pump = $82, requires_medical_escort = $83, \
            requires_extra_seat = $84, requires_accessible_lavatory = $85, wheelchair_type = \
            $86, accompanying_carer = $87, regular_medications = $88, controlled_drugs = $89, \
            dangerous_goods_battery_declaration = $90, sharps_in_cabin = $91, \
            refrigerated_medication = $92, customs_documentation_available = $93, \
            haemoglobin_g_per_l = $94, physician_declaration = $95, physician_signature_name \
            = $96, physician_signature_date = $97, valid_until_date = $98, additional_notes = \
            $99, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.submitter_name)
        .bind(&self.submitter_role)
        .bind(&self.submitter_email)
        .bind(&self.submitter_phone)
        .bind(&self.submitter_organisation)
        .bind(&self.airline_booking_reference)
        .bind(&self.airline_iata_code)
        .bind(&self.airline_name)
        .bind(&self.outbound_flight_number)
        .bind(self.outbound_date)
        .bind(&self.outbound_origin_iata)
        .bind(&self.outbound_destination_iata)
        .bind(&self.return_flight_number)
        .bind(self.return_date)
        .bind(&self.cabin_class)
        .bind(self.sector_duration_minutes)
        .bind(&self.transit_airports_iata)
        .bind(&self.special_assistance_codes)
        .bind(&self.reason_equipment)
        .bind(&self.reason_recent_acute_event)
        .bind(&self.reason_unstable_condition)
        .bind(&self.reason_communicable_disease)
        .bind(&self.reason_pregnancy)
        .bind(&self.reason_mobility_escort)
        .bind(&self.reason_psychiatric)
        .bind(&self.primary_diagnosis)
        .bind(&self.icd10_codes)
        .bind(self.diagnosis_date)
        .bind(&self.current_treatment)
        .bind(self.last_admission_date)
        .bind(self.last_discharge_date)
        .bind(self.last_specialist_review_date)
        .bind(self.resting_systolic_bp)
        .bind(self.resting_diastolic_bp)
        .bind(self.resting_heart_rate)
        .bind(&self.nyha_class)
        .bind(self.recent_mi_date)
        .bind(self.recent_stent_date)
        .bind(&self.on_anticoagulant)
        .bind(&self.pacemaker_or_icd)
        .bind(self.exercise_tolerance_metres)
        .bind(&self.unstable_angina)
        .bind(self.resting_spo2_percent)
        .bind(self.predicted_inflight_spo2_percent)
        .bind(&self.hypoxic_challenge_result)
        .bind(self.recent_pneumothorax_date)
        .bind(&self.asthma_severity)
        .bind(&self.copd_severity)
        .bind(&self.cpap_or_bipap_use)
        .bind(self.recent_pulmonary_embolism_date)
        .bind(self.last_surgery_date)
        .bind(&self.last_surgery_site)
        .bind(&self.cabin_gas_risk)
        .bind(&self.recent_fracture_cast)
        .bind(self.recent_dvt_date)
        .bind(&self.scuba_diving_within_24h)
        .bind(self.recent_stroke_date)
        .bind(&self.is_pregnant)
        .bind(self.gestation_weeks)
        .bind(&self.pregnancy_type)
        .bind(&self.pregnancy_complications)
        .bind(self.expected_delivery_date)
        .bind(&self.obstetrician_contact)
        .bind(&self.communicable_disease_status)
        .bind(self.last_symptom_date)
        .bind(&self.isolation_required)
        .bind(&self.vaccination_status)
        .bind(&self.current_antimicrobials)
        .bind(&self.requires_supplemental_oxygen)
        .bind(self.oxygen_flow_rate_lpm)
        .bind(&self.oxygen_duration)
        .bind(&self.requires_poc)
        .bind(&self.poc_make_model)
        .bind(self.poc_battery_hours)
        .bind(&self.requires_stretcher)
        .bind(&self.requires_incubator)
        .bind(&self.requires_iv_pump)
        .bind(&self.requires_medical_escort)
        .bind(&self.requires_extra_seat)
        .bind(&self.requires_accessible_lavatory)
        .bind(&self.wheelchair_type)
        .bind(&self.accompanying_carer)
        .bind(&self.regular_medications)
        .bind(&self.controlled_drugs)
        .bind(&self.dangerous_goods_battery_declaration)
        .bind(&self.sharps_in_cabin)
        .bind(&self.refrigerated_medication)
        .bind(&self.customs_documentation_available)
        .bind(self.haemoglobin_g_per_l)
        .bind(&self.physician_declaration)
        .bind(&self.physician_signature_name)
        .bind(self.physician_signature_date)
        .bind(self.valid_until_date)
        .bind(&self.additional_notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_information_form_for_air_travels/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
