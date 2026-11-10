#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::angiography_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub angiography_type: String,
    pub body_region: String,
    pub contrast_used: String,
    pub examination_adequacy: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub findings_narrative: String,
    pub significant_stenosis: bool,
    pub occlusion: bool,
    pub aneurysm: bool,
    pub dissection: bool,
    pub active_extravasation: bool,
    pub thrombus: bool,
    pub normal_vessels: bool,
    pub incidental_finding: bool,
    pub max_stenosis_percent: Option<f64>,
    pub intervention_performed: bool,
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
            "INSERT INTO angiography_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            angiography_type, body_region, contrast_used, examination_adequacy, \
            clinical_history, comparison_with_previous, findings_narrative, \
            significant_stenosis, occlusion, aneurysm, dissection, active_extravasation, \
            thrombus, normal_vessels, incidental_finding, max_stenosis_percent, \
            intervention_performed, impression, reporting_category, \
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
        .bind(&self.angiography_type)
        .bind(&self.body_region)
        .bind(&self.contrast_used)
        .bind(&self.examination_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.significant_stenosis)
        .bind(self.occlusion)
        .bind(self.aneurysm)
        .bind(self.dissection)
        .bind(self.active_extravasation)
        .bind(self.thrombus)
        .bind(self.normal_vessels)
        .bind(self.incidental_finding)
        .bind(self.max_stenosis_percent)
        .bind(self.intervention_performed)
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
            "UPDATE angiography_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, angiography_type = $8, body_region = $9, contrast_used = \
            $10, examination_adequacy = $11, clinical_history = $12, \
            comparison_with_previous = $13, findings_narrative = $14, \
            significant_stenosis = $15, occlusion = $16, aneurysm = $17, dissection = \
            $18, active_extravasation = $19, thrombus = $20, normal_vessels = $21, \
            incidental_finding = $22, max_stenosis_percent = $23, intervention_performed \
            = $24, impression = $25, reporting_category = $26, recommended_follow_up = \
            $27, critical_result_communicated = $28, reported_to = $29, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.angiography_type)
        .bind(&self.body_region)
        .bind(&self.contrast_used)
        .bind(&self.examination_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.significant_stenosis)
        .bind(self.occlusion)
        .bind(self.aneurysm)
        .bind(self.dissection)
        .bind(self.active_extravasation)
        .bind(self.thrombus)
        .bind(self.normal_vessels)
        .bind(self.incidental_finding)
        .bind(self.max_stenosis_percent)
        .bind(self.intervention_performed)
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
        .prefix("api/angiography_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
