#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::sleep_study_test_results::Model;

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
    pub study_type: String,
    pub study_adequacy: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub total_recording_time_hours: Option<f64>,
    pub total_sleep_time_hours: Option<f64>,
    pub apnoea_hypopnoea_index: Option<f64>,
    pub oxygen_desaturation_index: Option<f64>,
    pub minimum_spo2_percent: Option<f64>,
    pub time_below_90_percent_spo2: Option<f64>,
    pub mean_heart_rate_bpm: Option<i32>,
    pub osa_severity: String,
    pub obstructive_sleep_apnoea: bool,
    pub central_sleep_apnoea: bool,
    pub periodic_limb_movements: bool,
    pub nocturnal_hypoventilation: bool,
    pub significant_desaturation: bool,
    pub normal_study: bool,
    pub findings_narrative: String,
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
            "INSERT INTO sleep_study_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            study_type, study_adequacy, clinical_history, comparison_with_previous, \
            total_recording_time_hours, total_sleep_time_hours, apnoea_hypopnoea_index, \
            oxygen_desaturation_index, minimum_spo2_percent, time_below_90_percent_spo2, \
            mean_heart_rate_bpm, osa_severity, obstructive_sleep_apnoea, \
            central_sleep_apnoea, periodic_limb_movements, nocturnal_hypoventilation, \
            significant_desaturation, normal_study, findings_narrative, impression, \
            reporting_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, \
            $31) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.study_type)
        .bind(&self.study_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(self.total_recording_time_hours)
        .bind(self.total_sleep_time_hours)
        .bind(self.apnoea_hypopnoea_index)
        .bind(self.oxygen_desaturation_index)
        .bind(self.minimum_spo2_percent)
        .bind(self.time_below_90_percent_spo2)
        .bind(self.mean_heart_rate_bpm)
        .bind(&self.osa_severity)
        .bind(self.obstructive_sleep_apnoea)
        .bind(self.central_sleep_apnoea)
        .bind(self.periodic_limb_movements)
        .bind(self.nocturnal_hypoventilation)
        .bind(self.significant_desaturation)
        .bind(self.normal_study)
        .bind(&self.findings_narrative)
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
            "UPDATE sleep_study_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, study_type = $9, study_adequacy = $10, \
            clinical_history = $11, comparison_with_previous = $12, \
            total_recording_time_hours = $13, total_sleep_time_hours = $14, \
            apnoea_hypopnoea_index = $15, oxygen_desaturation_index = $16, \
            minimum_spo2_percent = $17, time_below_90_percent_spo2 = $18, mean_heart_rate_bpm \
            = $19, osa_severity = $20, obstructive_sleep_apnoea = $21, central_sleep_apnoea = \
            $22, periodic_limb_movements = $23, nocturnal_hypoventilation = $24, \
            significant_desaturation = $25, normal_study = $26, findings_narrative = $27, \
            impression = $28, reporting_category = $29, recommended_follow_up = $30, \
            critical_result_communicated = $31, reported_to = $32, updated_at = now() WHERE \
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
        .bind(&self.study_type)
        .bind(&self.study_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(self.total_recording_time_hours)
        .bind(self.total_sleep_time_hours)
        .bind(self.apnoea_hypopnoea_index)
        .bind(self.oxygen_desaturation_index)
        .bind(self.minimum_spo2_percent)
        .bind(self.time_below_90_percent_spo2)
        .bind(self.mean_heart_rate_bpm)
        .bind(&self.osa_severity)
        .bind(self.obstructive_sleep_apnoea)
        .bind(self.central_sleep_apnoea)
        .bind(self.periodic_limb_movements)
        .bind(self.nocturnal_hypoventilation)
        .bind(self.significant_desaturation)
        .bind(self.normal_study)
        .bind(&self.findings_narrative)
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
        .prefix("api/sleep_study_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
