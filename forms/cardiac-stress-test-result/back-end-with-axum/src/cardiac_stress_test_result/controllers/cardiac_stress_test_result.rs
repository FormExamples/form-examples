#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cardiac_stress_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub test_type: String,
    pub protocol: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub maximum_heart_rate_bpm: Option<i32>,
    pub percent_predicted_heart_rate: Option<f64>,
    pub exercise_duration_minutes: Option<f64>,
    pub mets_achieved: Option<f64>,
    pub peak_blood_pressure: String,
    pub blood_pressure_response: String,
    pub ischaemic_st_changes: bool,
    pub chest_pain_induced: bool,
    pub arrhythmia_induced: bool,
    pub terminated_early: bool,
    pub test_positive: bool,
    pub test_negative: bool,
    pub test_inconclusive: bool,
    pub reason_for_termination: String,
    pub duke_treadmill_score: Option<f64>,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO cardiac_stress_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            test_type, protocol, clinical_history, comparison_with_previous, \
            maximum_heart_rate_bpm, percent_predicted_heart_rate, \
            exercise_duration_minutes, mets_achieved, peak_blood_pressure, \
            blood_pressure_response, ischaemic_st_changes, chest_pain_induced, \
            arrhythmia_induced, terminated_early, test_positive, test_negative, \
            test_inconclusive, reason_for_termination, duke_treadmill_score, impression, \
            reporting_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, \
            $29, $30) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.test_type)
        .bind(&self.protocol)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(self.maximum_heart_rate_bpm)
        .bind(self.percent_predicted_heart_rate)
        .bind(self.exercise_duration_minutes)
        .bind(self.mets_achieved)
        .bind(&self.peak_blood_pressure)
        .bind(&self.blood_pressure_response)
        .bind(self.ischaemic_st_changes)
        .bind(self.chest_pain_induced)
        .bind(self.arrhythmia_induced)
        .bind(self.terminated_early)
        .bind(self.test_positive)
        .bind(self.test_negative)
        .bind(self.test_inconclusive)
        .bind(&self.reason_for_termination)
        .bind(self.duke_treadmill_score)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE cardiac_stress_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, test_type = $8, protocol = $9, clinical_history = $10, \
            comparison_with_previous = $11, maximum_heart_rate_bpm = $12, \
            percent_predicted_heart_rate = $13, exercise_duration_minutes = $14, \
            mets_achieved = $15, peak_blood_pressure = $16, blood_pressure_response = \
            $17, ischaemic_st_changes = $18, chest_pain_induced = $19, \
            arrhythmia_induced = $20, terminated_early = $21, test_positive = $22, \
            test_negative = $23, test_inconclusive = $24, reason_for_termination = $25, \
            duke_treadmill_score = $26, impression = $27, reporting_category = $28, \
            recommended_follow_up = $29, critical_result_communicated = $30, reported_to \
            = $31, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.test_type)
        .bind(&self.protocol)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(self.maximum_heart_rate_bpm)
        .bind(self.percent_predicted_heart_rate)
        .bind(self.exercise_duration_minutes)
        .bind(self.mets_achieved)
        .bind(&self.peak_blood_pressure)
        .bind(&self.blood_pressure_response)
        .bind(self.ischaemic_st_changes)
        .bind(self.chest_pain_induced)
        .bind(self.arrhythmia_induced)
        .bind(self.terminated_early)
        .bind(self.test_positive)
        .bind(self.test_negative)
        .bind(self.test_inconclusive)
        .bind(&self.reason_for_termination)
        .bind(self.duke_treadmill_score)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/cardiac_stress_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
