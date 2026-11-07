#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::electrocardiogram_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub ecg_type: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub recording_quality: String,
    pub clinical_history: String,
    pub ventricular_rate_bpm: Option<i32>,
    pub rhythm: String,
    pub pr_interval_ms: Option<i32>,
    pub qrs_duration_ms: Option<i32>,
    pub qt_interval_ms: Option<i32>,
    pub qtc_ms: Option<i32>,
    pub cardiac_axis: String,
    pub st_elevation: bool,
    pub st_depression: bool,
    pub t_wave_inversion: bool,
    pub pathological_q_waves: bool,
    pub left_ventricular_hypertrophy: bool,
    pub bundle_branch_block: bool,
    pub ischaemia: bool,
    pub normal_ecg: bool,
    pub interpretation: String,
    pub comparison_with_previous: String,
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
            "INSERT INTO electrocardiogram_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, ecg_type, performed_date, \
            reported_date, recording_quality, clinical_history, ventricular_rate_bpm, \
            rhythm, pr_interval_ms, qrs_duration_ms, qt_interval_ms, qtc_ms, \
            cardiac_axis, st_elevation, st_depression, t_wave_inversion, \
            pathological_q_waves, left_ventricular_hypertrophy, bundle_branch_block, \
            ischaemia, normal_ecg, interpretation, comparison_with_previous, impression, \
            reporting_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, \
            $29, $30, $31) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(&self.ecg_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.recording_quality)
        .bind(&self.clinical_history)
        .bind(self.ventricular_rate_bpm)
        .bind(&self.rhythm)
        .bind(self.pr_interval_ms)
        .bind(self.qrs_duration_ms)
        .bind(self.qt_interval_ms)
        .bind(self.qtc_ms)
        .bind(&self.cardiac_axis)
        .bind(self.st_elevation)
        .bind(self.st_depression)
        .bind(self.t_wave_inversion)
        .bind(self.pathological_q_waves)
        .bind(self.left_ventricular_hypertrophy)
        .bind(self.bundle_branch_block)
        .bind(self.ischaemia)
        .bind(self.normal_ecg)
        .bind(&self.interpretation)
        .bind(&self.comparison_with_previous)
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
            "UPDATE electrocardiogram_test_results SET patient_id = $2, clinician_id = \
            $3, originating_request_reference = $4, report_status = $5, ecg_type = $6, \
            performed_date = $7, reported_date = $8, recording_quality = $9, \
            clinical_history = $10, ventricular_rate_bpm = $11, rhythm = $12, \
            pr_interval_ms = $13, qrs_duration_ms = $14, qt_interval_ms = $15, qtc_ms = \
            $16, cardiac_axis = $17, st_elevation = $18, st_depression = $19, \
            t_wave_inversion = $20, pathological_q_waves = $21, \
            left_ventricular_hypertrophy = $22, bundle_branch_block = $23, ischaemia = \
            $24, normal_ecg = $25, interpretation = $26, comparison_with_previous = $27, \
            impression = $28, reporting_category = $29, recommended_follow_up = $30, \
            critical_result_communicated = $31, reported_to = $32, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(&self.ecg_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.recording_quality)
        .bind(&self.clinical_history)
        .bind(self.ventricular_rate_bpm)
        .bind(&self.rhythm)
        .bind(self.pr_interval_ms)
        .bind(self.qrs_duration_ms)
        .bind(self.qt_interval_ms)
        .bind(self.qtc_ms)
        .bind(&self.cardiac_axis)
        .bind(self.st_elevation)
        .bind(self.st_depression)
        .bind(self.t_wave_inversion)
        .bind(self.pathological_q_waves)
        .bind(self.left_ventricular_hypertrophy)
        .bind(self.bundle_branch_block)
        .bind(self.ischaemia)
        .bind(self.normal_ecg)
        .bind(&self.interpretation)
        .bind(&self.comparison_with_previous)
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
        .prefix("api/electrocardiogram_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
