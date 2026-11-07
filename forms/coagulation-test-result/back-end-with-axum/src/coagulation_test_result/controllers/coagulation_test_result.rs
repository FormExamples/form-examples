#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::coagulation_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub specimen_condition: String,
    pub clinical_history: String,
    pub on_anticoagulant: bool,
    pub anticoagulant_agent: String,
    pub prothrombin_time_seconds: Option<f64>,
    pub inr: Option<f64>,
    pub activated_partial_thromboplastin_time_seconds: Option<f64>,
    pub aptt_ratio: Option<f64>,
    pub fibrinogen_g_l: Option<f64>,
    pub d_dimer: Option<f64>,
    pub thrombin_time_seconds: Option<f64>,
    pub factor_assays: String,
    pub overall_result_status: String,
    pub critical_value_present: bool,
    pub critical_value_detail: String,
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
            "INSERT INTO coagulation_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            specimen_condition, clinical_history, on_anticoagulant, anticoagulant_agent, \
            prothrombin_time_seconds, inr, \
            activated_partial_thromboplastin_time_seconds, aptt_ratio, fibrinogen_g_l, \
            d_dimer, thrombin_time_seconds, factor_assays, overall_result_status, \
            critical_value_present, critical_value_detail, findings_narrative, \
            comparison_with_previous, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(self.on_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.prothrombin_time_seconds)
        .bind(self.inr)
        .bind(self.activated_partial_thromboplastin_time_seconds)
        .bind(self.aptt_ratio)
        .bind(self.fibrinogen_g_l)
        .bind(self.d_dimer)
        .bind(self.thrombin_time_seconds)
        .bind(&self.factor_assays)
        .bind(&self.overall_result_status)
        .bind(self.critical_value_present)
        .bind(&self.critical_value_detail)
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
            "UPDATE coagulation_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, specimen_condition = $8, clinical_history = $9, \
            on_anticoagulant = $10, anticoagulant_agent = $11, prothrombin_time_seconds \
            = $12, inr = $13, activated_partial_thromboplastin_time_seconds = $14, \
            aptt_ratio = $15, fibrinogen_g_l = $16, d_dimer = $17, thrombin_time_seconds \
            = $18, factor_assays = $19, overall_result_status = $20, \
            critical_value_present = $21, critical_value_detail = $22, \
            findings_narrative = $23, comparison_with_previous = $24, impression = $25, \
            reporting_category = $26, recommended_follow_up = $27, \
            critical_result_communicated = $28, reported_to = $29, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(self.on_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.prothrombin_time_seconds)
        .bind(self.inr)
        .bind(self.activated_partial_thromboplastin_time_seconds)
        .bind(self.aptt_ratio)
        .bind(self.fibrinogen_g_l)
        .bind(self.d_dimer)
        .bind(self.thrombin_time_seconds)
        .bind(&self.factor_assays)
        .bind(&self.overall_result_status)
        .bind(self.critical_value_present)
        .bind(&self.critical_value_detail)
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
        .prefix("api/coagulation_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
