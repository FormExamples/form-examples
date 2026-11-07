#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::fluoroscopy_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub study_type: String,
    pub contrast_used: String,
    pub examination_adequacy: String,
    pub screening_time_minutes: Option<f64>,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub findings_narrative: String,
    pub stricture: bool,
    pub reflux: bool,
    pub obstruction: bool,
    pub perforation_or_leak: bool,
    pub fistula: bool,
    pub filling_defect: bool,
    pub dysmotility: bool,
    pub normal_study: bool,
    pub incidental_finding: bool,
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
            "INSERT INTO fluoroscopy_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            study_type, contrast_used, examination_adequacy, screening_time_minutes, \
            clinical_history, comparison_with_previous, findings_narrative, stricture, \
            reflux, obstruction, perforation_or_leak, fistula, filling_defect, \
            dysmotility, normal_study, incidental_finding, impression, \
            reporting_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) \
            RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.study_type)
        .bind(&self.contrast_used)
        .bind(&self.examination_adequacy)
        .bind(self.screening_time_minutes)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.stricture)
        .bind(self.reflux)
        .bind(self.obstruction)
        .bind(self.perforation_or_leak)
        .bind(self.fistula)
        .bind(self.filling_defect)
        .bind(self.dysmotility)
        .bind(self.normal_study)
        .bind(self.incidental_finding)
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
            "UPDATE fluoroscopy_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, study_type = $8, contrast_used = $9, \
            examination_adequacy = $10, screening_time_minutes = $11, clinical_history = \
            $12, comparison_with_previous = $13, findings_narrative = $14, stricture = \
            $15, reflux = $16, obstruction = $17, perforation_or_leak = $18, fistula = \
            $19, filling_defect = $20, dysmotility = $21, normal_study = $22, \
            incidental_finding = $23, impression = $24, reporting_category = $25, \
            recommended_follow_up = $26, critical_result_communicated = $27, reported_to \
            = $28, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.study_type)
        .bind(&self.contrast_used)
        .bind(&self.examination_adequacy)
        .bind(self.screening_time_minutes)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.stricture)
        .bind(self.reflux)
        .bind(self.obstruction)
        .bind(self.perforation_or_leak)
        .bind(self.fistula)
        .bind(self.filling_defect)
        .bind(self.dysmotility)
        .bind(self.normal_study)
        .bind(self.incidental_finding)
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
        .prefix("api/fluoroscopy_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
