#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ct_scan_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub body_region: String,
    pub contrast_used: String,
    pub technique: String,
    pub examination_adequacy: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub findings_narrative: String,
    pub acute_finding: bool,
    pub mass_or_lesion: bool,
    pub haemorrhage: bool,
    pub infarct: bool,
    pub fracture: bool,
    pub infection_inflammation: bool,
    pub obstruction: bool,
    pub incidental_finding: bool,
    pub largest_lesion_size_mm: Option<f64>,
    pub radiation_dose_dlp: Option<f64>,
    pub impression: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ct_scan_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            body_region, contrast_used, technique, examination_adequacy, \
            clinical_history, comparison_with_previous, findings_narrative, \
            acute_finding, mass_or_lesion, haemorrhage, infarct, fracture, \
            infection_inflammation, obstruction, incidental_finding, \
            largest_lesion_size_mm, radiation_dose_dlp, impression, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.body_region)
        .bind(&self.contrast_used)
        .bind(&self.technique)
        .bind(&self.examination_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.acute_finding)
        .bind(self.mass_or_lesion)
        .bind(self.haemorrhage)
        .bind(self.infarct)
        .bind(self.fracture)
        .bind(self.infection_inflammation)
        .bind(self.obstruction)
        .bind(self.incidental_finding)
        .bind(self.largest_lesion_size_mm)
        .bind(self.radiation_dose_dlp)
        .bind(&self.impression)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ct_scan_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, body_region = $8, contrast_used = $9, technique = $10, \
            examination_adequacy = $11, clinical_history = $12, comparison_with_previous \
            = $13, findings_narrative = $14, acute_finding = $15, mass_or_lesion = $16, \
            haemorrhage = $17, infarct = $18, fracture = $19, infection_inflammation = \
            $20, obstruction = $21, incidental_finding = $22, largest_lesion_size_mm = \
            $23, radiation_dose_dlp = $24, impression = $25, recommended_follow_up = \
            $26, critical_result_communicated = $27, reported_to = $28, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.body_region)
        .bind(&self.contrast_used)
        .bind(&self.technique)
        .bind(&self.examination_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.acute_finding)
        .bind(self.mass_or_lesion)
        .bind(self.haemorrhage)
        .bind(self.infarct)
        .bind(self.fracture)
        .bind(self.infection_inflammation)
        .bind(self.obstruction)
        .bind(self.incidental_finding)
        .bind(self.largest_lesion_size_mm)
        .bind(self.radiation_dose_dlp)
        .bind(&self.impression)
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
        .prefix("api/ct_scan_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
