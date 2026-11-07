#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ambulatory_blood_pressure_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub monitoring_type: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub valid_readings_percent: Option<f64>,
    pub recording_adequate: bool,
    pub clinical_history: String,
    pub daytime_average_systolic: Option<f64>,
    pub daytime_average_diastolic: Option<f64>,
    pub nighttime_average_systolic: Option<f64>,
    pub nighttime_average_diastolic: Option<f64>,
    pub twenty_four_hour_average_systolic: Option<f64>,
    pub twenty_four_hour_average_diastolic: Option<f64>,
    pub nocturnal_dip_percent: Option<f64>,
    pub dipper_status: String,
    pub hypertension_confirmed: bool,
    pub white_coat_effect: bool,
    pub masked_hypertension: bool,
    pub severe_hypertension: bool,
    pub nocturnal_hypertension: bool,
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
            "INSERT INTO ambulatory_blood_pressure_test_results (patient_id, \
            clinician_id, originating_request_reference, monitoring_type, report_status, \
            performed_date, reported_date, valid_readings_percent, recording_adequate, \
            clinical_history, daytime_average_systolic, daytime_average_diastolic, \
            nighttime_average_systolic, nighttime_average_diastolic, \
            twenty_four_hour_average_systolic, twenty_four_hour_average_diastolic, \
            nocturnal_dip_percent, dipper_status, hypertension_confirmed, \
            white_coat_effect, masked_hypertension, severe_hypertension, \
            nocturnal_hypertension, normal_study, findings_narrative, \
            comparison_with_previous, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31) \
            RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.monitoring_type)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(self.valid_readings_percent)
        .bind(self.recording_adequate)
        .bind(&self.clinical_history)
        .bind(self.daytime_average_systolic)
        .bind(self.daytime_average_diastolic)
        .bind(self.nighttime_average_systolic)
        .bind(self.nighttime_average_diastolic)
        .bind(self.twenty_four_hour_average_systolic)
        .bind(self.twenty_four_hour_average_diastolic)
        .bind(self.nocturnal_dip_percent)
        .bind(&self.dipper_status)
        .bind(self.hypertension_confirmed)
        .bind(self.white_coat_effect)
        .bind(self.masked_hypertension)
        .bind(self.severe_hypertension)
        .bind(self.nocturnal_hypertension)
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
            "UPDATE ambulatory_blood_pressure_test_results SET patient_id = $2, \
            clinician_id = $3, originating_request_reference = $4, monitoring_type = $5, \
            report_status = $6, performed_date = $7, reported_date = $8, \
            valid_readings_percent = $9, recording_adequate = $10, clinical_history = \
            $11, daytime_average_systolic = $12, daytime_average_diastolic = $13, \
            nighttime_average_systolic = $14, nighttime_average_diastolic = $15, \
            twenty_four_hour_average_systolic = $16, twenty_four_hour_average_diastolic \
            = $17, nocturnal_dip_percent = $18, dipper_status = $19, \
            hypertension_confirmed = $20, white_coat_effect = $21, masked_hypertension = \
            $22, severe_hypertension = $23, nocturnal_hypertension = $24, normal_study = \
            $25, findings_narrative = $26, comparison_with_previous = $27, impression = \
            $28, reporting_category = $29, recommended_follow_up = $30, \
            critical_result_communicated = $31, reported_to = $32, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.monitoring_type)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(self.valid_readings_percent)
        .bind(self.recording_adequate)
        .bind(&self.clinical_history)
        .bind(self.daytime_average_systolic)
        .bind(self.daytime_average_diastolic)
        .bind(self.nighttime_average_systolic)
        .bind(self.nighttime_average_diastolic)
        .bind(self.twenty_four_hour_average_systolic)
        .bind(self.twenty_four_hour_average_diastolic)
        .bind(self.nocturnal_dip_percent)
        .bind(&self.dipper_status)
        .bind(self.hypertension_confirmed)
        .bind(self.white_coat_effect)
        .bind(self.masked_hypertension)
        .bind(self.severe_hypertension)
        .bind(self.nocturnal_hypertension)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/ambulatory_blood_pressure_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
