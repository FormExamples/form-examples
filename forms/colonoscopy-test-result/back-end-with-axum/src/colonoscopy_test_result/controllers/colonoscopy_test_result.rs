#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::colonoscopy_test_results::Model;

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
    pub extent_reached: String,
    pub bowel_preparation_quality: String,
    pub sedation_used: bool,
    pub clinical_history: String,
    pub polyps_found: bool,
    pub mass_lesion: bool,
    pub diverticulosis: bool,
    pub inflammation_ibd: bool,
    pub angiodysplasia: bool,
    pub bleeding_source_identified: bool,
    pub normal_examination: bool,
    pub polyp_count: Option<i32>,
    pub largest_polyp_mm: Option<f64>,
    pub biopsy_taken: bool,
    pub polypectomy_performed: bool,
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
            "INSERT INTO colonoscopy_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            procedure, extent_reached, bowel_preparation_quality, sedation_used, \
            clinical_history, polyps_found, mass_lesion, diverticulosis, \
            inflammation_ibd, angiodysplasia, bleeding_source_identified, \
            normal_examination, polyp_count, largest_polyp_mm, biopsy_taken, \
            polypectomy_performed, complication, findings_narrative, impression, \
            reporting_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, \
            $29) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.procedure)
        .bind(&self.extent_reached)
        .bind(&self.bowel_preparation_quality)
        .bind(self.sedation_used)
        .bind(&self.clinical_history)
        .bind(self.polyps_found)
        .bind(self.mass_lesion)
        .bind(self.diverticulosis)
        .bind(self.inflammation_ibd)
        .bind(self.angiodysplasia)
        .bind(self.bleeding_source_identified)
        .bind(self.normal_examination)
        .bind(self.polyp_count)
        .bind(self.largest_polyp_mm)
        .bind(self.biopsy_taken)
        .bind(self.polypectomy_performed)
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
            "UPDATE colonoscopy_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, procedure = $8, extent_reached = $9, \
            bowel_preparation_quality = $10, sedation_used = $11, clinical_history = \
            $12, polyps_found = $13, mass_lesion = $14, diverticulosis = $15, \
            inflammation_ibd = $16, angiodysplasia = $17, bleeding_source_identified = \
            $18, normal_examination = $19, polyp_count = $20, largest_polyp_mm = $21, \
            biopsy_taken = $22, polypectomy_performed = $23, complication = $24, \
            findings_narrative = $25, impression = $26, reporting_category = $27, \
            recommended_follow_up = $28, critical_result_communicated = $29, reported_to \
            = $30, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.procedure)
        .bind(&self.extent_reached)
        .bind(&self.bowel_preparation_quality)
        .bind(self.sedation_used)
        .bind(&self.clinical_history)
        .bind(self.polyps_found)
        .bind(self.mass_lesion)
        .bind(self.diverticulosis)
        .bind(self.inflammation_ibd)
        .bind(self.angiodysplasia)
        .bind(self.bleeding_source_identified)
        .bind(self.normal_examination)
        .bind(self.polyp_count)
        .bind(self.largest_polyp_mm)
        .bind(self.biopsy_taken)
        .bind(self.polypectomy_performed)
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
        .prefix("api/colonoscopy_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
