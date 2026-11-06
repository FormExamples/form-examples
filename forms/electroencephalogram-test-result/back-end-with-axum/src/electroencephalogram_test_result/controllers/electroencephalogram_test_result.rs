#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::electroencephalogram_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub eeg_type: String,
    pub recording_duration_minutes: Option<f64>,
    pub recording_quality: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub background_rhythm: String,
    pub epileptiform_discharges: bool,
    pub focal_slowing: bool,
    pub generalised_slowing: bool,
    pub seizure_recorded: bool,
    pub status_epilepticus: bool,
    pub photoparoxysmal_response: bool,
    pub normal_eeg: bool,
    pub findings_narrative: String,
    pub clinical_correlation: String,
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
            "INSERT INTO electroencephalogram_test_results (deleted_at, patient_id, \
            clinician_id, originating_request_reference, report_status, performed_date, \
            reported_date, eeg_type, recording_duration_minutes, recording_quality, \
            clinical_history, comparison_with_previous, background_rhythm, \
            epileptiform_discharges, focal_slowing, generalised_slowing, seizure_recorded, \
            status_epilepticus, photoparoxysmal_response, normal_eeg, findings_narrative, \
            clinical_correlation, impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.eeg_type)
        .bind(self.recording_duration_minutes)
        .bind(&self.recording_quality)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.background_rhythm)
        .bind(self.epileptiform_discharges)
        .bind(self.focal_slowing)
        .bind(self.generalised_slowing)
        .bind(self.seizure_recorded)
        .bind(self.status_epilepticus)
        .bind(self.photoparoxysmal_response)
        .bind(self.normal_eeg)
        .bind(&self.findings_narrative)
        .bind(&self.clinical_correlation)
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
            "UPDATE electroencephalogram_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, eeg_type = $9, \
            recording_duration_minutes = $10, recording_quality = $11, clinical_history = \
            $12, comparison_with_previous = $13, background_rhythm = $14, \
            epileptiform_discharges = $15, focal_slowing = $16, generalised_slowing = $17, \
            seizure_recorded = $18, status_epilepticus = $19, photoparoxysmal_response = $20, \
            normal_eeg = $21, findings_narrative = $22, clinical_correlation = $23, \
            impression = $24, reporting_category = $25, recommended_follow_up = $26, \
            critical_result_communicated = $27, reported_to = $28, updated_at = now() WHERE \
            id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.eeg_type)
        .bind(self.recording_duration_minutes)
        .bind(&self.recording_quality)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.background_rhythm)
        .bind(self.epileptiform_discharges)
        .bind(self.focal_slowing)
        .bind(self.generalised_slowing)
        .bind(self.seizure_recorded)
        .bind(self.status_epilepticus)
        .bind(self.photoparoxysmal_response)
        .bind(self.normal_eeg)
        .bind(&self.findings_narrative)
        .bind(&self.clinical_correlation)
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
        .prefix("api/electroencephalogram_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
