#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::return_to_works::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub employer_id: Option<Uuid>,
    pub status: String,
    pub statement_kind: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub absence_first_day: Option<Date>,
    pub absence_total_calendar_days: Option<i32>,
    pub prior_med3_reference: String,
    pub prior_self_certification_reference: String,
    pub primary_diagnosis_text: String,
    pub primary_diagnosis_snomed: String,
    pub primary_diagnosis_icd10: String,
    pub comorbid_conditions: String,
    pub mechanism: String,
    pub workplace_cause: String,
    pub riddor_reference: String,
    pub current_medications: String,
    pub ongoing_therapy: String,
    pub last_consultation_date: Option<Date>,
    pub anticipated_recovery_trajectory: String,
    pub specialist_followup_required: String,
    pub mobility: String,
    pub manual_handling_capacity_kg: Option<f64>,
    pub cognition: String,
    pub mood: String,
    pub sleep: String,
    pub pain_score_0_10: Option<i32>,
    pub driving_capacity: String,
    pub standing_tolerance_minutes: Option<i32>,
    pub sitting_tolerance_minutes: Option<i32>,
    pub screen_tolerance_minutes: Option<i32>,
    pub adl_independence: String,
    pub fitness_statement_computed: String,
    pub fitness_statement_final: String,
    pub clinician_override: String,
    pub clinician_override_reason: String,
    pub clinician_confidence: String,
    pub valid_from: Option<Date>,
    pub valid_until: Option<Date>,
    pub validity_weeks: Option<i32>,
    pub reassessment_required: String,
    pub phased_return_applicable: String,
    pub phased_return_template: String,
    pub phased_return_target_date: Option<Date>,
    pub phased_return_schedule_json: serde_json::Value,
    pub phased_return_support_contact: String,
    pub workstation_review_required: String,
    pub additional_adjustments_text: String,
    pub review_location: String,
    pub review_date: Option<Date>,
    pub occupational_health_referral_made: String,
    pub dvla_notification_required: String,
    pub employer_oh_notified: String,
    pub return_to_work_meeting_scheduled: String,
    pub maternity_certificate_reference: String,
    pub final_notes: String,
    pub signature_svg: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO return_to_works (deleted_at, patient_id, clinician_id, employer_id, \
            status, statement_kind, assessment_date, assessment_time, absence_first_day, \
            absence_total_calendar_days, prior_med3_reference, \
            prior_self_certification_reference, primary_diagnosis_text, \
            primary_diagnosis_snomed, primary_diagnosis_icd10, comorbid_conditions, \
            mechanism, workplace_cause, riddor_reference, current_medications, \
            ongoing_therapy, last_consultation_date, anticipated_recovery_trajectory, \
            specialist_followup_required, mobility, manual_handling_capacity_kg, cognition, \
            mood, sleep, pain_score_0_10, driving_capacity, standing_tolerance_minutes, \
            sitting_tolerance_minutes, screen_tolerance_minutes, adl_independence, \
            fitness_statement_computed, fitness_statement_final, clinician_override, \
            clinician_override_reason, clinician_confidence, valid_from, valid_until, \
            validity_weeks, reassessment_required, phased_return_applicable, \
            phased_return_template, phased_return_target_date, phased_return_schedule_json, \
            phased_return_support_contact, workstation_review_required, \
            additional_adjustments_text, review_location, review_date, \
            occupational_health_referral_made, dvla_notification_required, \
            employer_oh_notified, return_to_work_meeting_scheduled, \
            maternity_certificate_reference, final_notes, signature_svg, signed_at) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, \
            $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, \
            $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.employer_id)
        .bind(&self.status)
        .bind(&self.statement_kind)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(self.absence_first_day)
        .bind(self.absence_total_calendar_days)
        .bind(&self.prior_med3_reference)
        .bind(&self.prior_self_certification_reference)
        .bind(&self.primary_diagnosis_text)
        .bind(&self.primary_diagnosis_snomed)
        .bind(&self.primary_diagnosis_icd10)
        .bind(&self.comorbid_conditions)
        .bind(&self.mechanism)
        .bind(&self.workplace_cause)
        .bind(&self.riddor_reference)
        .bind(&self.current_medications)
        .bind(&self.ongoing_therapy)
        .bind(self.last_consultation_date)
        .bind(&self.anticipated_recovery_trajectory)
        .bind(&self.specialist_followup_required)
        .bind(&self.mobility)
        .bind(self.manual_handling_capacity_kg)
        .bind(&self.cognition)
        .bind(&self.mood)
        .bind(&self.sleep)
        .bind(self.pain_score_0_10)
        .bind(&self.driving_capacity)
        .bind(self.standing_tolerance_minutes)
        .bind(self.sitting_tolerance_minutes)
        .bind(self.screen_tolerance_minutes)
        .bind(&self.adl_independence)
        .bind(&self.fitness_statement_computed)
        .bind(&self.fitness_statement_final)
        .bind(&self.clinician_override)
        .bind(&self.clinician_override_reason)
        .bind(&self.clinician_confidence)
        .bind(self.valid_from)
        .bind(self.valid_until)
        .bind(self.validity_weeks)
        .bind(&self.reassessment_required)
        .bind(&self.phased_return_applicable)
        .bind(&self.phased_return_template)
        .bind(self.phased_return_target_date)
        .bind(&self.phased_return_schedule_json)
        .bind(&self.phased_return_support_contact)
        .bind(&self.workstation_review_required)
        .bind(&self.additional_adjustments_text)
        .bind(&self.review_location)
        .bind(self.review_date)
        .bind(&self.occupational_health_referral_made)
        .bind(&self.dvla_notification_required)
        .bind(&self.employer_oh_notified)
        .bind(&self.return_to_work_meeting_scheduled)
        .bind(&self.maternity_certificate_reference)
        .bind(&self.final_notes)
        .bind(&self.signature_svg)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE return_to_works SET deleted_at = $2, patient_id = $3, clinician_id = $4, \
            employer_id = $5, status = $6, statement_kind = $7, assessment_date = $8, \
            assessment_time = $9, absence_first_day = $10, absence_total_calendar_days = $11, \
            prior_med3_reference = $12, prior_self_certification_reference = $13, \
            primary_diagnosis_text = $14, primary_diagnosis_snomed = $15, \
            primary_diagnosis_icd10 = $16, comorbid_conditions = $17, mechanism = $18, \
            workplace_cause = $19, riddor_reference = $20, current_medications = $21, \
            ongoing_therapy = $22, last_consultation_date = $23, \
            anticipated_recovery_trajectory = $24, specialist_followup_required = $25, \
            mobility = $26, manual_handling_capacity_kg = $27, cognition = $28, mood = $29, \
            sleep = $30, pain_score_0_10 = $31, driving_capacity = $32, \
            standing_tolerance_minutes = $33, sitting_tolerance_minutes = $34, \
            screen_tolerance_minutes = $35, adl_independence = $36, \
            fitness_statement_computed = $37, fitness_statement_final = $38, \
            clinician_override = $39, clinician_override_reason = $40, clinician_confidence = \
            $41, valid_from = $42, valid_until = $43, validity_weeks = $44, \
            reassessment_required = $45, phased_return_applicable = $46, \
            phased_return_template = $47, phased_return_target_date = $48, \
            phased_return_schedule_json = $49, phased_return_support_contact = $50, \
            workstation_review_required = $51, additional_adjustments_text = $52, \
            review_location = $53, review_date = $54, occupational_health_referral_made = \
            $55, dvla_notification_required = $56, employer_oh_notified = $57, \
            return_to_work_meeting_scheduled = $58, maternity_certificate_reference = $59, \
            final_notes = $60, signature_svg = $61, signed_at = $62, updated_at = now() WHERE \
            id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.employer_id)
        .bind(&self.status)
        .bind(&self.statement_kind)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(self.absence_first_day)
        .bind(self.absence_total_calendar_days)
        .bind(&self.prior_med3_reference)
        .bind(&self.prior_self_certification_reference)
        .bind(&self.primary_diagnosis_text)
        .bind(&self.primary_diagnosis_snomed)
        .bind(&self.primary_diagnosis_icd10)
        .bind(&self.comorbid_conditions)
        .bind(&self.mechanism)
        .bind(&self.workplace_cause)
        .bind(&self.riddor_reference)
        .bind(&self.current_medications)
        .bind(&self.ongoing_therapy)
        .bind(self.last_consultation_date)
        .bind(&self.anticipated_recovery_trajectory)
        .bind(&self.specialist_followup_required)
        .bind(&self.mobility)
        .bind(self.manual_handling_capacity_kg)
        .bind(&self.cognition)
        .bind(&self.mood)
        .bind(&self.sleep)
        .bind(self.pain_score_0_10)
        .bind(&self.driving_capacity)
        .bind(self.standing_tolerance_minutes)
        .bind(self.sitting_tolerance_minutes)
        .bind(self.screen_tolerance_minutes)
        .bind(&self.adl_independence)
        .bind(&self.fitness_statement_computed)
        .bind(&self.fitness_statement_final)
        .bind(&self.clinician_override)
        .bind(&self.clinician_override_reason)
        .bind(&self.clinician_confidence)
        .bind(self.valid_from)
        .bind(self.valid_until)
        .bind(self.validity_weeks)
        .bind(&self.reassessment_required)
        .bind(&self.phased_return_applicable)
        .bind(&self.phased_return_template)
        .bind(self.phased_return_target_date)
        .bind(&self.phased_return_schedule_json)
        .bind(&self.phased_return_support_contact)
        .bind(&self.workstation_review_required)
        .bind(&self.additional_adjustments_text)
        .bind(&self.review_location)
        .bind(self.review_date)
        .bind(&self.occupational_health_referral_made)
        .bind(&self.dvla_notification_required)
        .bind(&self.employer_oh_notified)
        .bind(&self.return_to_work_meeting_scheduled)
        .bind(&self.maternity_certificate_reference)
        .bind(&self.final_notes)
        .bind(&self.signature_svg)
        .bind(self.signed_at)
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
        .prefix("api/return_to_works/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
