#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::holter_monitor_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub monitor_type: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub recording_duration_hours: Option<f64>,
    pub analysed_percent: Option<f64>,
    pub clinical_history: String,
    pub predominant_rhythm: String,
    pub mean_heart_rate_bpm: Option<i32>,
    pub minimum_heart_rate_bpm: Option<i32>,
    pub maximum_heart_rate_bpm: Option<i32>,
    pub longest_pause_seconds: Option<f64>,
    pub ventricular_ectopic_percent: Option<f64>,
    pub supraventricular_ectopic_percent: Option<f64>,
    pub atrial_fibrillation_detected: bool,
    pub significant_pauses: bool,
    pub ventricular_tachycardia: bool,
    pub supraventricular_tachycardia: bool,
    pub high_grade_av_block: bool,
    pub symptom_rhythm_correlation: bool,
    pub normal_study: bool,
    pub findings_narrative: String,
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
            "INSERT INTO holter_monitor_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, monitor_type, performed_date, \
            reported_date, recording_duration_hours, analysed_percent, clinical_history, \
            predominant_rhythm, mean_heart_rate_bpm, minimum_heart_rate_bpm, \
            maximum_heart_rate_bpm, longest_pause_seconds, ventricular_ectopic_percent, \
            supraventricular_ectopic_percent, atrial_fibrillation_detected, \
            significant_pauses, ventricular_tachycardia, supraventricular_tachycardia, \
            high_grade_av_block, symptom_rhythm_correlation, normal_study, \
            findings_narrative, comparison_with_previous, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(&self.monitor_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(self.recording_duration_hours)
        .bind(self.analysed_percent)
        .bind(&self.clinical_history)
        .bind(&self.predominant_rhythm)
        .bind(self.mean_heart_rate_bpm)
        .bind(self.minimum_heart_rate_bpm)
        .bind(self.maximum_heart_rate_bpm)
        .bind(self.longest_pause_seconds)
        .bind(self.ventricular_ectopic_percent)
        .bind(self.supraventricular_ectopic_percent)
        .bind(self.atrial_fibrillation_detected)
        .bind(self.significant_pauses)
        .bind(self.ventricular_tachycardia)
        .bind(self.supraventricular_tachycardia)
        .bind(self.high_grade_av_block)
        .bind(self.symptom_rhythm_correlation)
        .bind(self.normal_study)
        .bind(&self.findings_narrative)
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
            "UPDATE holter_monitor_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            monitor_type = $7, performed_date = $8, reported_date = $9, \
            recording_duration_hours = $10, analysed_percent = $11, clinical_history = $12, \
            predominant_rhythm = $13, mean_heart_rate_bpm = $14, minimum_heart_rate_bpm = \
            $15, maximum_heart_rate_bpm = $16, longest_pause_seconds = $17, \
            ventricular_ectopic_percent = $18, supraventricular_ectopic_percent = $19, \
            atrial_fibrillation_detected = $20, significant_pauses = $21, \
            ventricular_tachycardia = $22, supraventricular_tachycardia = $23, \
            high_grade_av_block = $24, symptom_rhythm_correlation = $25, normal_study = $26, \
            findings_narrative = $27, comparison_with_previous = $28, impression = $29, \
            reporting_category = $30, recommended_follow_up = $31, \
            critical_result_communicated = $32, reported_to = $33, updated_at = now() WHERE \
            id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(&self.monitor_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(self.recording_duration_hours)
        .bind(self.analysed_percent)
        .bind(&self.clinical_history)
        .bind(&self.predominant_rhythm)
        .bind(self.mean_heart_rate_bpm)
        .bind(self.minimum_heart_rate_bpm)
        .bind(self.maximum_heart_rate_bpm)
        .bind(self.longest_pause_seconds)
        .bind(self.ventricular_ectopic_percent)
        .bind(self.supraventricular_ectopic_percent)
        .bind(self.atrial_fibrillation_detected)
        .bind(self.significant_pauses)
        .bind(self.ventricular_tachycardia)
        .bind(self.supraventricular_tachycardia)
        .bind(self.high_grade_av_block)
        .bind(self.symptom_rhythm_correlation)
        .bind(self.normal_study)
        .bind(&self.findings_narrative)
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
        .prefix("api/holter_monitor_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
