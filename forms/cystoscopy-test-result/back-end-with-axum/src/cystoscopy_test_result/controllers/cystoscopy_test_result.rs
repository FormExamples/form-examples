#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cystoscopy_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub procedure: String,
    pub anaesthesia: String,
    pub clinical_history: String,
    pub bladder_tumour: bool,
    pub inflammation_cystitis: bool,
    pub bladder_stones: bool,
    pub urethral_stricture: bool,
    pub trabeculation: bool,
    pub prostatic_enlargement: bool,
    pub normal_examination: bool,
    pub tumour_size_mm: Option<f64>,
    pub tumour_appearance: String,
    pub biopsy_taken: bool,
    pub complication: String,
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
            "INSERT INTO cystoscopy_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            procedure, anaesthesia, clinical_history, bladder_tumour, \
            inflammation_cystitis, bladder_stones, urethral_stricture, trabeculation, \
            prostatic_enlargement, normal_examination, tumour_size_mm, \
            tumour_appearance, biopsy_taken, complication, findings_narrative, \
            impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.procedure)
        .bind(&self.anaesthesia)
        .bind(&self.clinical_history)
        .bind(self.bladder_tumour)
        .bind(self.inflammation_cystitis)
        .bind(self.bladder_stones)
        .bind(self.urethral_stricture)
        .bind(self.trabeculation)
        .bind(self.prostatic_enlargement)
        .bind(self.normal_examination)
        .bind(self.tumour_size_mm)
        .bind(&self.tumour_appearance)
        .bind(self.biopsy_taken)
        .bind(&self.complication)
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
            "UPDATE cystoscopy_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, procedure = $8, anaesthesia = $9, clinical_history = \
            $10, bladder_tumour = $11, inflammation_cystitis = $12, bladder_stones = \
            $13, urethral_stricture = $14, trabeculation = $15, prostatic_enlargement = \
            $16, normal_examination = $17, tumour_size_mm = $18, tumour_appearance = \
            $19, biopsy_taken = $20, complication = $21, findings_narrative = $22, \
            impression = $23, reporting_category = $24, recommended_follow_up = $25, \
            critical_result_communicated = $26, reported_to = $27, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.procedure)
        .bind(&self.anaesthesia)
        .bind(&self.clinical_history)
        .bind(self.bladder_tumour)
        .bind(self.inflammation_cystitis)
        .bind(self.bladder_stones)
        .bind(self.urethral_stricture)
        .bind(self.trabeculation)
        .bind(self.prostatic_enlargement)
        .bind(self.normal_examination)
        .bind(self.tumour_size_mm)
        .bind(&self.tumour_appearance)
        .bind(self.biopsy_taken)
        .bind(&self.complication)
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
        .prefix("api/cystoscopy_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
