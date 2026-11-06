#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pulmonary_function_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub test_type: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub report_status: String,
    pub test_quality: String,
    pub clinical_history: String,
    pub fev1_litres: Option<f64>,
    pub fev1_percent_predicted: Option<f64>,
    pub fvc_litres: Option<f64>,
    pub fvc_percent_predicted: Option<f64>,
    pub fev1_fvc_ratio: Option<f64>,
    pub peak_expiratory_flow: Option<f64>,
    pub dlco_percent_predicted: Option<f64>,
    pub ventilatory_pattern: String,
    pub severity: String,
    pub bronchodilator_reversibility: String,
    pub airflow_obstruction: bool,
    pub restriction: bool,
    pub reduced_gas_transfer: bool,
    pub significant_reversibility: bool,
    pub normal_spirometry: bool,
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
            "INSERT INTO pulmonary_function_test_results (deleted_at, patient_id, \
            clinician_id, originating_request_reference, test_type, performed_date, \
            reported_date, report_status, test_quality, clinical_history, fev1_litres, \
            fev1_percent_predicted, fvc_litres, fvc_percent_predicted, fev1_fvc_ratio, \
            peak_expiratory_flow, dlco_percent_predicted, ventilatory_pattern, severity, \
            bronchodilator_reversibility, airflow_obstruction, restriction, \
            reduced_gas_transfer, significant_reversibility, normal_spirometry, \
            findings_narrative, comparison_with_previous, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.test_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.report_status)
        .bind(&self.test_quality)
        .bind(&self.clinical_history)
        .bind(self.fev1_litres)
        .bind(self.fev1_percent_predicted)
        .bind(self.fvc_litres)
        .bind(self.fvc_percent_predicted)
        .bind(self.fev1_fvc_ratio)
        .bind(self.peak_expiratory_flow)
        .bind(self.dlco_percent_predicted)
        .bind(&self.ventilatory_pattern)
        .bind(&self.severity)
        .bind(&self.bronchodilator_reversibility)
        .bind(self.airflow_obstruction)
        .bind(self.restriction)
        .bind(self.reduced_gas_transfer)
        .bind(self.significant_reversibility)
        .bind(self.normal_spirometry)
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
            "UPDATE pulmonary_function_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, test_type = $6, \
            performed_date = $7, reported_date = $8, report_status = $9, test_quality = $10, \
            clinical_history = $11, fev1_litres = $12, fev1_percent_predicted = $13, \
            fvc_litres = $14, fvc_percent_predicted = $15, fev1_fvc_ratio = $16, \
            peak_expiratory_flow = $17, dlco_percent_predicted = $18, ventilatory_pattern = \
            $19, severity = $20, bronchodilator_reversibility = $21, airflow_obstruction = \
            $22, restriction = $23, reduced_gas_transfer = $24, significant_reversibility = \
            $25, normal_spirometry = $26, findings_narrative = $27, comparison_with_previous \
            = $28, impression = $29, reporting_category = $30, recommended_follow_up = $31, \
            critical_result_communicated = $32, reported_to = $33, updated_at = now() WHERE \
            id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.test_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.report_status)
        .bind(&self.test_quality)
        .bind(&self.clinical_history)
        .bind(self.fev1_litres)
        .bind(self.fev1_percent_predicted)
        .bind(self.fvc_litres)
        .bind(self.fvc_percent_predicted)
        .bind(self.fev1_fvc_ratio)
        .bind(self.peak_expiratory_flow)
        .bind(self.dlco_percent_predicted)
        .bind(&self.ventilatory_pattern)
        .bind(&self.severity)
        .bind(&self.bronchodilator_reversibility)
        .bind(self.airflow_obstruction)
        .bind(self.restriction)
        .bind(self.reduced_gas_transfer)
        .bind(self.significant_reversibility)
        .bind(self.normal_spirometry)
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
        .prefix("api/pulmonary_function_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
