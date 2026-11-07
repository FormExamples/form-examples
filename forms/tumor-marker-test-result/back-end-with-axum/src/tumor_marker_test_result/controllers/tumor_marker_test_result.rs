#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::tumor_marker_test_results::Model;

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
    pub known_cancer_site: String,
    pub psa: Option<f64>,
    pub ca125: Option<f64>,
    pub ca19_9: Option<f64>,
    pub carcinoembryonic_antigen_cea: Option<f64>,
    pub alpha_fetoprotein_afp: Option<f64>,
    pub beta_hcg: Option<f64>,
    pub ca15_3: Option<f64>,
    pub lactate_dehydrogenase_ldh: Option<f64>,
    pub calcitonin: Option<f64>,
    pub chromogranin_a: Option<f64>,
    pub previous_value: Option<f64>,
    pub trend: String,
    pub comparison_with_previous: String,
    pub overall_result_status: String,
    pub markedly_elevated: bool,
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
            "INSERT INTO tumor_marker_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            specimen_condition, clinical_history, known_cancer_site, psa, ca125, ca19_9, \
            carcinoembryonic_antigen_cea, alpha_fetoprotein_afp, beta_hcg, ca15_3, \
            lactate_dehydrogenase_ldh, calcitonin, chromogranin_a, previous_value, \
            trend, comparison_with_previous, overall_result_status, markedly_elevated, \
            findings_narrative, impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(&self.known_cancer_site)
        .bind(self.psa)
        .bind(self.ca125)
        .bind(self.ca19_9)
        .bind(self.carcinoembryonic_antigen_cea)
        .bind(self.alpha_fetoprotein_afp)
        .bind(self.beta_hcg)
        .bind(self.ca15_3)
        .bind(self.lactate_dehydrogenase_ldh)
        .bind(self.calcitonin)
        .bind(self.chromogranin_a)
        .bind(self.previous_value)
        .bind(&self.trend)
        .bind(&self.comparison_with_previous)
        .bind(&self.overall_result_status)
        .bind(self.markedly_elevated)
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
            "UPDATE tumor_marker_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, specimen_condition = $8, clinical_history = $9, \
            known_cancer_site = $10, psa = $11, ca125 = $12, ca19_9 = $13, \
            carcinoembryonic_antigen_cea = $14, alpha_fetoprotein_afp = $15, beta_hcg = \
            $16, ca15_3 = $17, lactate_dehydrogenase_ldh = $18, calcitonin = $19, \
            chromogranin_a = $20, previous_value = $21, trend = $22, \
            comparison_with_previous = $23, overall_result_status = $24, \
            markedly_elevated = $25, findings_narrative = $26, impression = $27, \
            reporting_category = $28, recommended_follow_up = $29, \
            critical_result_communicated = $30, reported_to = $31, updated_at = now() \
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
        .bind(&self.known_cancer_site)
        .bind(self.psa)
        .bind(self.ca125)
        .bind(self.ca19_9)
        .bind(self.carcinoembryonic_antigen_cea)
        .bind(self.alpha_fetoprotein_afp)
        .bind(self.beta_hcg)
        .bind(self.ca15_3)
        .bind(self.lactate_dehydrogenase_ldh)
        .bind(self.calcitonin)
        .bind(self.chromogranin_a)
        .bind(self.previous_value)
        .bind(&self.trend)
        .bind(&self.comparison_with_previous)
        .bind(&self.overall_result_status)
        .bind(self.markedly_elevated)
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
        .prefix("api/tumor_marker_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
